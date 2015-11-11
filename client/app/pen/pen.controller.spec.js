'use strict';

describe('Controller: PenCtrl', function () {

  // load the controller's module
  beforeEach(module('ziplineFcc2App'));

  var PenCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PenCtrl = $controller('PenCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
