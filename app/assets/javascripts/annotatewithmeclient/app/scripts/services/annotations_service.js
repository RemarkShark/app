'use strict';

/**
 * @ngdoc service
 * @name annotatewithmeApp.AnnotationsService
 * @description
 * # AnnotationsService
 * Service in the annotatewithmeApp.
 */
angular.module('annotatewithmeApp')
  .service('AnnotationsService', ['Utilities', 'Constants', '$routeParams', '$rootScope', function AnnotationsService(Utilities, Constants, $routeParams, $rootScope) {
    var db = new Lawnchair({name: Constants["annotations_db"]+$routeParams.sessionId});
    var unpersisted = {persisted: false, deleted: false};
    this.createAnnotation = function(annotation){
      var uuid = Utilities.uuid();
    	db.save({key: uuid, value:  $.extend(true, annotation, unpersisted, {"id": uuid})});
    };
    this.createPersistedAnnotation = function(annotation){
      db.save({key: annotation["id"], value:  $.extend(true, annotation, {"deleted": false, "persisted": true})},function(){
        $rootScope.$broadcast("annotations-changed");
      });
    };
    this.getAnnotations = function(callback){
      var annotations = [];
      db.all(callback);
    };
    this.getAllUndeleted = function(callback){
      db.where('record.value.deleted == false', callback);
    };
    this.getAllMarkedDelete = function(callback){
      db.where('record.value.deleted == true', callback);
    };
    this.updateAnnotation = function(id, annotation){
      db.remove(id);
      annotation["persisted"] = false;
      db.save({key: id, value:  annotation});
    };
    this.deleteAnnotation = function(id){
    	db.remove(id ,function(){
        $rootScope.$broadcast("annotations-changed");
      });
    };
    this.flagDeletedAnnotation = function(id){
      var new_id;
      if(typeof id == "number"){
        new_id = id
      }else{
        new_id = '"'+id+'"';
      }
      db.where('record.key == '+new_id, function(annotation){
        if(annotation.length != 0){
        annotation = annotation[0];
        if(annotation.value.persisted == true){
          annotation.value.deleted = true;
          db.save(annotation);
        }else{
          db.remove(id);
        }
      }
      });
    };
    this.findAndInsert = function(id, callback){
       var new_id;
      if(typeof id == "number"){
        new_id = id
      }else{
        new_id = '"'+id+'"';
      }
      db.where('record.key == '+new_id, callback);
    };
    this.deleteAll = function(){
      db.nuke();
    };
    this.getAllUnpersisted = function(callback){
    	db.where('record.value.persisted == false', callback);
    };
    this.getLatestAnnotation = function(callback){
      db.where('record.value.persisted == true', function(annotations){
        if(annotations.length > 0){
          var latest = _.max(annotations, function(annotation){ return (new Date(annotation.value.updated_at)); });
          callback(parseInt(new Date(latest.value.updated_at).getTime()/1000));
        }else{
          callback(parseInt((new Date(new Date() - 3600000)).getTime()/1000));
        }
      });
    }
  }]);
