'use strict';

/**
 * @ngdoc directive
 * @name annotatewithmeApp.directive:annotorious
 * @description
 * # annotorious
 */
angular.module('annotatewithmeApp')
  .directive('annotorious', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        anno.makeAnnotatable(element[0]);
      }
    };
  });
