'use strict';

/**
 * @ngdoc overview
 * @name annotatewithmeApp
 * @description
 * # annotatewithmeApp
 *
 * Main module of the application.
 */
angular
    .module('annotatewithmeApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch'
    ])
    .config(function ($routeProvider) {
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
