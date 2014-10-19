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

    var getPeerUpdates = function(){
      AnnotationsService.getLatestAnnotation(function(timestamp){
        console.log(timestamp);
        $http.get('/api/v1/sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/transactions?after='+timestamp).then(function(response){
          var annotations = response.data;
          console.log("in peer updates",annotations);
          try{
            angular.forEach(annotations, function(annotation){
              var obj = annotation.object;
              if(obj.is_deleted){
                AnnotationsService.deleteAnnotation(obj["id"]);
              }else{
                AnnotationsService.createPersistedAnnotation(obj);
              }
            });
            syncInProgress = false;
          }catch(e){
            console.log("got exception sync in progress");
            syncInProgress = false;
          }
        },function(error){
          console.log(error);
          syncInProgress = false;
        });
      });
    }

    var removeAnnotations = function(){
      AnnotationsService.getAllMarkedDelete(function(annotations){
        if(annotations.length == 0){
          getPeerUpdates();
        }
        console.log("in delete callback", annotations);
        angular.forEach(annotations,function(annot){
          var annotation = annot.value;
          $http.delete('/api/v1/sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/annotations/'+annotation["id"]).then(function(response){
            console.log("in delete", annotation);
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
      console.log("polling.....", syncInProgress, Utilities.isOnline());
      if(!syncInProgress && Utilities.isOnline()){
        try{
          syncInProgress = true;
          AnnotationsService.getAllUnpersisted(function(annotations){
            if(annotations.length == 0){
              //syncInProgress = false;
              removeAnnotations();
            }
            angular.forEach(annotations,function(annot){
              var annotation = annot.value;
              $http.post('/api/v1/sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/annotations', {annotation: annotation}).then(function(ann){
                    AnnotationsService.deleteAnnotation(annotation["id"]);
                    console.log("annotation is", annotation);
                    console.log("ann is", ann);
                    var new_annot = ann.data;
                    AnnotationsService.createPersistedAnnotation(new_annot);
                    if(annotations.indexOf(annot) == (annotations.length - 1)){
                      //syncInProgress = false;
                      removeAnnotations();
                    }
                  },function(error){
                    console.log(error);
                    if(annotations.indexOf(annot) == (annotations.length - 1)){
                      //syncInProgress = false;
                      removeAnnotations();
                    }
                  });
              });
          });
        }catch(e){
          syncInProgress = false;
          console.log(e);
        }
      } 
      $timeout(poller, 5000);     
    };
    poller();

    return {};
  }]);
