'use strict';

/**
 * @ngdoc function
 * @name annotatewithmeApp.controller:AnnotationCtrl
 * @description
 * # AnnotationCtrl
 * Controller of the annotatewithmeApp
 */
angular.module('annotatewithmeApp')
    .controller('AnnotationCtrl', ["$scope", "AnnotationsService", "$routeParams", "$timeout", function ($scope, AnnotationsService, $routeParams, $timeout) {

      anno.destroy();

      $scope.session = JSON.parse(sessionStorage.getItem($routeParams.sessionId));
      $scope.session.imgSrc = $scope.session["img_src"];

      $scope.annotations = [];

      var applyPhase = function () {
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      };

      var getAnnotationCallback = function (annots) {
        angular.forEach(annots, function (obj) {
          var annotation = obj.value;
          if($scope.annotations.indexOf(annotation) == -1){
          	$scope.annotations.push(annotation);
          	anno.addAnnotation(annotation);
          }
        });
        applyPhase();
      };

      $scope.addHighlight = function(annotation){
      	anno.highlightAnnotation(annotation);
      };

      $scope.removeHighlight = function(){
      	anno.highlightAnnotation();
      };

      $scope.$on("annotorious-ready", function () {
        var annotations_poll = function(){
      		AnnotationsService.getAllUndeleted(getAnnotationCallback);
      	};
      	$timeout(annotations_poll, 5000);
      });

      anno.addHandler('onAnnotationCreated', function (annotation) {
        AnnotationsService.createAnnotation(annotation);
        $scope.annotations.push(annotation);
        applyPhase();
      });

      anno.addHandler('onAnnotationRemoved', function (annotation) {
        AnnotationsService.flagDeletedAnnotation(annotation["id"]);
        $scope.annotations.splice($scope.annotations.indexOf(annotation), 1);
        applyPhase();
      });

      anno.addHandler('onAnnotationUpdated', function (annotation) {
        $scope.annotations = $scope.annotations.filter(function (item) {
          var dup_item = $.extend(true, dup_item, item);
          var dup_annotation = $.extend(true, dup_annotation, annotation);
          delete dup_item["text"];
          delete dup_annotation["text"];
          if (JSON.stringify(dup_item) == JSON.stringify(dup_annotation)) {
            AnnotationsService.updateAnnotation(item["id"], annotation);
            return false;
          }
          return true;
        });

        $scope.annotations.push(annotation);

        applyPhase();
      });
    }]);
