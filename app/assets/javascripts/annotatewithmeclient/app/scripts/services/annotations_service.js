'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.AnnotationsService
 * @description
 * # AnnotationsService
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .service('AnnotationsService', [function AnnotationsService() {
    var db_name = "annotations";
    var db = new Lawnchair({name: db_name});
    this.createAnnotation = function(index, annotation){
    	db.save({key: index.toString(), value:  JSON.stringify(annotation)});
    };
    this.getAnnotations = function(callback){
      var annotations = [];
      db.all(callback);
    };
    this.updateAnnotation = function(index, annotation){
      db.remove(index.toString());
      db.save({key: index.toString(), value:  JSON.stringify(annotation)});
    };
    this.deleteAnnotation = function(index){
    	db.remove(index.toString());
    };
    this.deleteAll = function(index){
      db.nuke();
    }
  }]);
