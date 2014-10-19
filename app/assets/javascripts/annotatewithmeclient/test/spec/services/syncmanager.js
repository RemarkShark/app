'use strict';

describe('Service: Syncmanager', function () {

  // load the service's module
  beforeEach(module('annotatewithmeApp'));

  // instantiate service
  var Syncmanager;
  beforeEach(inject(function (_Syncmanager_) {
    Syncmanager = _Syncmanager_;
  }));

  it('should do something', function () {
    expect(!!Syncmanager).toBe(true);
  });

});
