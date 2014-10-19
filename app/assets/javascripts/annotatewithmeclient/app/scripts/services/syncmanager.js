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

    var removeAnnotations = function(){
      AnnotationsService.getAllMarkedDelete(function(annotations){
        if(annotations.length == 0){
          syncInProgress = false;
        }
        angular.forEach(annotations,function(annot){
          var annotation = annot.value;
          $http.delete(Constants["base_url"]+'sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/annotations/'+annotation["id"]).then(function(response){
            AnnotationsService.deleteAnnotation(annotation["id"]);
            if(annotations.indexOf(annot) == (annotations.length - 1)){
              $rootScope.$broadcast("annotations-changed");
              syncInProgress = false;
            }
          },function(error){
            if(annotations.indexOf(annot) == (annotations.length - 1)){
              syncInProgress = false;
            }
          });
        });
      });
    };

    var poller = function() {
      console.log("polling.....", syncInProgress, Utilities.isOnline());
      if(!syncInProgress && Utilities.isOnline()){
        syncInProgress = true;
        AnnotationsService.getAllUnpersisted(function(annotations){
          if(annotations.length == 0){
            //syncInProgress = false;
            removeAnnotations();
          }
          angular.forEach(annotations,function(annot){
            var annotation = annot.value;
            $http.post(Constants["base_url"]+'sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/annotations', {annotation: annotation}).then(function(ann){
                  AnnotationsService.deleteAnnotation(annotation["id"]);
                  console.log("ann is", ann);
                  var new_annot = ann.data;
                  AnnotationsService.createPersistedAnnotation(new_annot);
                  if(annotations.indexOf(annot) == (annotations.length - 1)){
                    //syncInProgress = false;
                    $rootScope.$broadcast("annotations-changed");
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

      } 
      $timeout(poller, 5000);     
    };
    poller();

    return {};
  }]);
