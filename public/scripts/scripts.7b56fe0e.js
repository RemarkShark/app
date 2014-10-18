"use strict";angular.module("annotatewithmeApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/annotate.html",controller:"AnnotationCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("annotatewithmeApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("annotatewithmeApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("annotatewithmeApp").controller("AnnotationCtrl",["$scope","AnnotationsService",function(a,b){a.annotations=[];var c=function(b){angular.forEach(b,function(b){var c=JSON.parse(b.value);a.annotations.push(c),anno.addAnnotation(c)}),a.$apply()};b.getAnnotations(c),anno.addHandler("onAnnotationCreated",function(c){b.createAnnotation(a.annotations.length,c),a.annotations.push(c),a.$apply()}),anno.addHandler("onAnnotationRemoved",function(c){b.deleteAnnotation(a.annotations.indexOf(c)),a.annotations.splice(a.annotations.indexOf(c),1),a.$apply()}),anno.addHandler("onAnnotationUpdated",function(c){a.annotations=a.annotations.filter(function(d){var e=$.extend(!0,e,d),f=$.extend(!0,f,c);return delete e.text,delete f.text,JSON.stringify(e)==JSON.stringify(f)?(b.updateAnnotation(a.annotations.indexOf(d),c),!1):!0}),a.annotations.push(c),a.$apply()})}]),angular.module("annotatewithmeApp").directive("annotorious",function(){return{restrict:"A",link:function(a,b){anno.makeAnnotatable(b[0])}}}),angular.module("annotatewithmeApp").service("AnnotationsService",[function(){var a="annotations",b=new Lawnchair({name:a});this.createAnnotation=function(a,c){b.save({key:a.toString(),value:JSON.stringify(c)})},this.getAnnotations=function(a){b.all(a)},this.updateAnnotation=function(a,c){b.remove(a.toString()),b.save({key:a.toString(),value:JSON.stringify(c)})},this.deleteAnnotation=function(a){b.remove(a.toString())},this.deleteAll=function(){b.nuke()}}]),angular.module("annotatewithmeApp").factory("LawnchairFactory",["$window","$log","$parse",function(a,b,c){return function(d,e){function f(a){try{return s(a)}catch(b){return null}}function g(a){return new Lawnchair({name:d},a)}function h(c,d){d=d.toString(),angular.isObject(c)&&c!==p[d]?(p[d]=p[d]||{},angular.extend(p[d],c)):p[d]=c;var e={key:d,value:t(p[d])};try{g(function(){this.save(e)})}catch(f){("QUOTA_EXCEEDED_ERR"===f.name||"NS_ERROR_DOM_QUOTA_REACHED"===f.name)&&a.localStorage.clear(),b.info("LocalStorage Exception ==> "+f.message)}}function i(a){return q.length=0,_.each(a,function(a){q.push(a)}),q}function j(a,b){a&&angular.isObject(a)&&p[b]&&p[b]!==a?angular.extend(p[b],a):p[b]=a}function k(a,b){return b&&(angular.isObject(b.value)&&angular.isObject(a)?angular.extend(a,u(b.value)):a=u(b.value),j(a,b.key)),a}function l(a){return g(function(){this.all(function(b){angular.forEach(b,function(a){j(a.value,a.key)}),a&&a(p)})}),p}function m(a){return i(l(function(b){i(b),a&&a(q)}))}function n(a){delete p[a],g(function(){this.remove(a)})}function o(a){if(p[a])return p[a];var b={};return s.assign(b,a),b}var p={},q=[],r=e&&e.isArray,s=c(e&&e.entryKey?e.entryKey:"id"),t=e&&e.transformSave?e.transformSave:angular.identity,u=e&&e.transformLoad?e.transformLoad:angular.identity,v={collection:p,save:function(a,b,c){if(a||(a=p,b=null),angular.isArray(a)?angular.forEach(a,function(a,b){h(a,f(a)||b)}):b||a&&f(a)?h(a,b||f(a)):angular.forEach(a,h),c){var d=angular.isArray(a)?_.chain(a).map(f).map(String).value():_.keys(a);_.chain(p).keys().difference(d).each(n),_.chain(p).filter(function(a){return!f(a)}).keys().each(n)}r&&i(p)},batch:function(a,b,c){var d=_.chain(a).map(function(a){return o(a)}).value();return b&&angular.isArray(b)?(b.length=0,_.each(d,function(a){b.push(a)})):b=d,g(function(){this.get(a,function(a){if(a)for(var d=a.length-1;d>=0;d--)b[d]=k(b[d],a[d]);c&&c(b)})}),b},get:function(a,b){var c=o(a);return g(function(){this.get(a,function(a){a&&(c=k(c,a)),b&&b(c)})}),c},all:r?m:l,remove:n,nuke:function(){g(function(){this.nuke()})},destroy:function(){for(var a in p)delete p[a];g(function(){this.nuke()})}};return v}}]);