'use strict';

/**
 * @ngdoc function
 * @name annotatewithmeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the annotatewithmeApp
 */
angular.module('annotatewithmeApp')
    .controller('MainCtrl', function ($scope, $location, $timeout, Session) {
      $scope.newSession = function (imageUrl) {
        if (imageUrl && imageUrl.trim().length > 0) {
          Session.create(imageUrl).then(function (createdSession) {
            $timeout(function () {
              $location.path("/sessions/" + createdSession.data.uniq_hash);
            });
          });
        }
      };

      $scope.joinSession = function (sessionId) {
        if (sessionId) {
          $timeout(function () {
            $location.path("/sessions/" + sessionId);
          });
        }
        ;
      };
    });
