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
        var imageElement = element[0];
        $(imageElement).bind('load', function() {
          $timeout(function(){
            anno.makeAnnotatable(imageElement);
            $rootScope.$broadcast("annotorious-ready");
          });
          scope.$on("$destroy", function(){
            anno.destroy(imageElement.src)
          })
        });
      }
    };
  });
