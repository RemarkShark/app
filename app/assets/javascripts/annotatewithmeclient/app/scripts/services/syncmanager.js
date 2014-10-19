'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.Syncmanager
 * @description
 * # Syncmanager
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .service('Syncmanager',['$timeout', 'AnnotationsService', 'Constants', '$http', '$routeParams', 'Utilities', '$rootScope', function Syncmanager($timeout, AnnotationsService, Constants, $http, $routeParams, Utilities, $rootScope) {
    var syncInProgress = false;
    var synDownCount = 0;

    var getPeerUpdates = function(){
      AnnotationsService.getLatestAnnotation(function(timestamp){
        $http.get('/api/v1/sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/transactions?after='+timestamp).then(function(response){
          var annotations = response.data;
          try{
            angular.forEach(annotations, function(annotation){
              var obj = annotation.object;
              if(obj.is_deleted){
                AnnotationsService.deleteAnnotation(obj["id"]);
              }else{
                AnnotationsService.findAndInsert(obj["id"], function(annotations){
                  if(annotations.length == 0){
                    AnnotationsService.createPersistedAnnotation(obj);
                  }
                });
              }
            });
            syncInProgress = false;
          }catch(e){
            syncInProgress = false;
          }
        },function(error){
          syncInProgress = false;
        });
      });
    }

    var removeAnnotations = function(){
      AnnotationsService.getAllMarkedDelete(function(annotations){
        if(annotations.length == 0){
          getPeerUpdates();
        }
        angular.forEach(annotations,function(annot){
          var annotation = annot.value;
          $http.delete('/api/v1/sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/annotations/'+annotation["id"]).then(function(response){
            AnnotationsService.deleteAnnotation(annotation["id"]);
            if(annotations.indexOf(annot) == (annotations.length - 1)){
              getPeerUpdates();
            }
          },function(error){
            if(annotations.indexOf(annot) == (annotations.length - 1)){
              getPeerUpdates();
            }
          });
        });
      });
    };

    var poller = function() {
      if(syncInProgress){
        synDownCount++;
        if(synDownCount > 2){
          syncInProgress = false;
          synDownCount = 0;
        }
      }
      if(!syncInProgress && Utilities.isOnline()){
        try{
          syncInProgress = true;
          AnnotationsService.getAllUnpersisted(function(annotations){
            if(annotations.length == 0){
              removeAnnotations();
            }
            angular.forEach(annotations,function(annot){
              var annotation = annot.value;
              $http.post('/api/v1/sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/annotations', {annotation: annotation}).then(function(ann){
                    AnnotationsService.deleteAnnotation(annotation["id"]);
                    var new_annot = ann.data;
                    AnnotationsService.createPersistedAnnotation(new_annot);
                    if(annotations.indexOf(annot) == (annotations.length - 1)){
                      removeAnnotations();
                    }
                  },function(error){
                    if(annotations.indexOf(annot) == (annotations.length - 1)){
                      removeAnnotations();
                    }
                  });
              });
          });
        }catch(e){
          $timeout(function(){
            syncInProgress = false;
          },5000);
        }
      } 
      $timeout(poller, 5000);     
    };
    poller();

    return {};
  }]);
