'use strict';

/**
 * @ngdoc function
 * @name annotatewithmeApp.controller:AnnotationCtrl
 * @description
 * # AnnotationCtrl
 * Controller of the annotatewithmeApp
 */
angular.module('annotatewithmeApp')
  .controller('AnnotationCtrl',["$scope", function ($scope) {
  $scope.annotations = []; //will be using the service here to get the annotations.
	anno.addHandler('onAnnotationCreated', function(annotation) {
  	$scope.annotations.push(annotation);
    $scope.$apply();
	});
  anno.addHandler('onAnnotationRemoved', function(annotation) {
    $scope.annotations.splice( $scope.annotations.indexOf(annotation), 1 );
    $scope.$apply();
  });
  anno.addHandler('onAnnotationUpdated', function(annotation) {
    $scope.annotations = $scope.annotations.filter(function(item) {
      var dup_item = $.extend(true, dup_item, item);
      var dup_annotation = $.extend(true, dup_annotation, annotation);
      delete dup_item["text"];
      delete dup_annotation["text"];
      if(JSON.stringify(dup_item) ==  JSON.stringify(dup_annotation)){
        return false;
      }
      return true;
    });
    $scope.annotations.push(annotation);
    $scope.$apply();
  });
}]);
