'use strict';

/**
 * @ngdoc overview
 * @name annotatewithmeApp
 * @description
 * # annotatewithmeApp
 *
 * Main module of the application.
 */
var app = angular
    .module('annotatewithmeApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'angular-loading-bar'
    ]);

    app.config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/sessions/:sessionId', {
            templateUrl: 'views/annotate.html',
            controller: 'AnnotationCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
    });

    app.run(["Syncmanager", function(Syncmanager) {}]);
