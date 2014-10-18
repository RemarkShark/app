'use strict';

describe('Service: AnnotationsService', function () {

  // load the service's module
  beforeEach(module('annotatewithmeApp'));

  // instantiate service
  var AnnotationsService;
  beforeEach(inject(function (_AnnotationsService_) {
    AnnotationsService = _AnnotationsService_;
  }));

  it('should do something', function () {
    expect(!!AnnotationsService).toBe(true);
  });

});
