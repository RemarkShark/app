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
      'ngTouch',
      'angular-loading-bar'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
          .when('/sessions/:sessionId', {
            templateUrl: 'views/annotate.html',
            controller: 'AnnotationCtrl',
            resolve: {
              session: function ($q, $route, Session) {
                var deferred = $q.defer();
                var sessionId = $route.current.params.sessionId;
                var foundCached = sessionStorage.getItem(sessionId);
                if (foundCached) {
                  deferred.resolve(JSON.parse(foundCached));
                } else {
                  Session.fetch(sessionId).then(function (foundSession) {
                    $('head').append('<link rel="prefetch" href="'+ foundSession.data["img_src"] + '">');
                    sessionStorage.setItem(foundSession.data.uniq_hash, JSON.stringify(foundSession.data));
                    deferred.resolve(foundSession.data);
                  });
                }
                return deferred.promise;
              }
            }})
          .otherwise({
            redirectTo: '/'
          });
    })
;
