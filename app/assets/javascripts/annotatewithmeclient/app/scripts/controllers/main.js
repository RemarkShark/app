'use strict';

/**
 * @ngdoc function
 * @name annotatewithmeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the annotatewithmeApp
 */
angular.module('annotatewithmeApp')
    .controller('MainCtrl', function ($scope, $location, $timeout) {
      $scope.joinSession = function (sessionId) {
        if (sessionId) {
          $timeout(function () {
            $location.path("/sessions/" + sessionId);
          })

        }
      };
    });
