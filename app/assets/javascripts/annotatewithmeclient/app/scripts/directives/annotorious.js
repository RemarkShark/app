'use strict';

/**
 * @ngdoc directive
 * @name annotatewithmeApp.directive:annotorious
 * @description
 * # annotorious
 */
angular.module('annotatewithmeApp')
  .directive('annotorious', function ($rootScope, $timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $timeout(function(){
          anno.makeAnnotatable(element[0]);
          $rootScope.$broadcast("annotorious-ready");
        }, 1000);
      }
    };
  });
