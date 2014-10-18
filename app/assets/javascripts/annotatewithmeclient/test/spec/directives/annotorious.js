'use strict';

describe('Directive: annotorious', function () {

  // load the directive's module
  beforeEach(module('annotatewithmeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<annotorious></annotorious>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the annotorious directive');
  }));
});
