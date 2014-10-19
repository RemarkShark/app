'use strict';

/**
 * @ngdoc directive
 * @name annotatewithmeApp.directive:annotorious
 * @description
 * # annotorious
 */
angular.module('annotatewithmeApp')
  .directive('annotorious', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        $timeout(function(){
          anno.makeAnnotatable(element[0]);
        }, 1000);
      }
    };
  });
