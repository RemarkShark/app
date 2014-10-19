'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.SessionService
 * @description
 * # SessionService
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
    .service('Session', function SessionService($http) {
      return {
        create: function(imageUrl){
          return $http.post("/api/v1/sessions", {"img_src": imageUrl});
        },
        fetch: function(id){
          return $http.get("/api/v1/sessions/" + id);
        }
      }
    });
