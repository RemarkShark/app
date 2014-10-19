'use strict';

describe('Service: Utilities', function () {

  // load the service's module
  beforeEach(module('annotatewithmeApp'));

  // instantiate service
  var Utilities;
  beforeEach(inject(function (_Utilities_) {
    Utilities = _Utilities_;
  }));

  it('should do something', function () {
    expect(!!Utilities).toBe(true);
  });

});
