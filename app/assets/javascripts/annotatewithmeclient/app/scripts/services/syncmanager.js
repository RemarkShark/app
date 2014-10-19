'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.Syncmanager
 * @description
 * # Syncmanager
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .service('Syncmanager',['$timeout', 'AnnotationsService', 'Constants', '$http', '$routeParams', 'Utilities', function Syncmanager($timeout, AnnotationsService, Constants, $http, $routeParams, Utilities) {
    var syncInProgress = false;
    var poller = function() {
      console.log("polling.....", syncInProgress, Utilities.isOnline());
      if(!syncInProgress && Utilities.isOnline()){
        syncInProgress = true;
        AnnotationsService.getAllUnpersisted(function(annotations){
          angular.forEach(annotations,function(annot){
            var annotation = annot.value;
            $http.post(Constants["base_url"]+'sessions/'+JSON.parse(sessionStorage.getItem($routeParams.sessionId))["id"]+'/annotations', {annotation: annotation}).then(function(annot){
                  AnnotationsService.deleteAnnotation(annotation["id"]);
                  AnnotationsService.createPersistedAnnotation(annotation);
                  if(annotations.indexOf(annot) == (annotations.length - 1)){
                    syncInProgress = false;
                  }
                },function(error){
                  console.log(error);
                  if(annotations.indexOf(annot) == (annotations.length - 1)){
                    syncInProgress = false;
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
