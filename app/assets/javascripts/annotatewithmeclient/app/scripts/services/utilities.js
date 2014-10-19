'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.Utilities
 * @description
 * # Utilities
 * Service in the annotatewithmeApp.
 */
 angular.module('annotatewithmeApp')
 .service('Utilities',["$window", function Utilities($window) {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  };

  var appOnline = false;
  //Notify subscribers
  var broadcast = function (state) {
    appOnline = state;
    $rootScope.$broadcast('event:network-connectivity', state);
  };

  appOnline = $window.navigator.onLine;
  // Setup a callback that fires whenever the browser goes online
  $window.addEventListener("online", function () {
    broadcast(true);
  }, false);

  // Setup a callback that fires whenever the browser goes offline
  $window.addEventListener("offline", function () {
    broadcast(false);
  }, false);

  return {
    uuid: function () {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
    },
    isOnline: function(){
      return appOnline;
    }
  }
}]);
