'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.AnnotationsService
 * @description
 * # AnnotationsService
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .service('AnnotationsService', ['Utilities', 'Constants', function AnnotationsService(Utilities, Constants) {
    var db = new Lawnchair({name: Constants["annotations_db"]});
    var unpersisted = {persisted: false};
    this.createAnnotation = function(index, annotation){
      var uuid = Utilities.uuid();
    	db.save({key: uuid, value:  $.extend(true, annotation, unpersisted, {"id": uuid})});
    };
    this.getAnnotations = function(callback){
      var annotations = [];
      db.all(callback);
    };
    this.updateAnnotation = function(id, annotation){
      db.remove(id);
      annotation["persisted"] = false;
      db.save({key: id, value:  annotation});
    };
    this.deleteAnnotation = function(id){
    	db.remove(id);
    };
    this.deleteAll = function(){
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
