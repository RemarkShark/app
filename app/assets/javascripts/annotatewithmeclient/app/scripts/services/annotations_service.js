'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.AnnotationsService
 * @description
 * # AnnotationsService
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .service('AnnotationsService', ['Utilities', 'Constants', '$routeParams', function AnnotationsService(Utilities, Constants, $routeParams) {
    var db = new Lawnchair({name: Constants["annotations_db"]+$routeParams.sessionId});
    var unpersisted = {persisted: false, deleted: false};
    this.createAnnotation = function(annotation){
      var uuid = Utilities.uuid();
    	db.save({key: uuid, value:  $.extend(true, annotation, unpersisted, {"id": uuid})});
    };
    this.createPersistedAnnotation = function(annotation){
      db.save({key: annotation["id"], value:  $.extend(true, annotation, {"deleted": false, "persisted": true})});
    };
    this.getAnnotations = function(callback){
      var annotations = [];
      db.all(callback);
    };
    this.getAllUndeleted = function(callback){
      db.where('record.value.deleted == false', callback);
    };
    this.updateAnnotation = function(id, annotation){
      db.remove(id);
      annotation["persisted"] = false;
      db.save({key: id, value:  annotation});
    };
    this.deleteAnnotation = function(id){
    	db.remove(id);
    };
    this.flagDeletedAnnotation = function(id){
      db.where('record.key == "'+id+'"', function(annotation){
        annotation = annotation[0];
        annotation.value.deleted = true;
        db.save(annotation);
      });
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
