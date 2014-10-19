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
        var image = element[0];
        $timeout(function(){
          anno.makeAnnotatable(image);
          $rootScope.$broadcast("annotorious-ready");
        }, 1000);
        scope.$on("$destroy", function(){
          anno.destroy(image.src)
        })
      }
    };
  });
