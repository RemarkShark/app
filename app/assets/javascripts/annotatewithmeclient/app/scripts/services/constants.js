'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.Constants
 * @description
 * # Constants
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .constant('Constants',{
  	'base_url': "http://localhost:3000/api/v1/",//"http://boiling-spire-5369.herokuapp.com/api/v1/",
  	'annotations_db': "annotations"
  });
