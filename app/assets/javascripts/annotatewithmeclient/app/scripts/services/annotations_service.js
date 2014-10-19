'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.AnnotationsService
 * @description
 * # AnnotationsService
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .service('AnnotationsService', ['Utilities',function AnnotationsService(Utilities) {
    var db_name = "annotations";
    var db = new Lawnchair({name: db_name});
    var unpersisted = {persisted: false};
    this.createAnnotation = function(index, annotation){
    	db.save({key: Utilities.uuid(), value:  $.extend(true, annotation, unpersisted)});
    };
    this.getAnnotations = function(callback){
      var annotations = [];
      db.all(callback);
    };
    this.updateAnnotation = function(index, annotation){
      db.remove(index.toString());
      db.save({key: index.toString(), value:  annotation});
    };
    this.deleteAnnotation = function(index){
    	db.remove(index.toString());
    };
    this.deleteAll = function(index){
      db.nuke();
    };
    this.getAllUnpersisted = function(callback){
    	db.where('record.value.persisted == false', callback);
      /*callback = function(annots){
        angular.forEach(annots, function (obj) {
          var annotation = obj.value;
        });
      }*/
    };
  }]);
