'use strict';

describe('Filter: penTags', function () {

  // load the filter's module
  beforeEach(module('ziplineFcc2App'));

  // initialize a new instance of the filter before each test
  var penTags;
  beforeEach(inject(function ($filter) {
    penTags = $filter('penTags');
  }));

  it('should return the input prefixed with "penTags filter:"', function () {
    var text = 'angularjs';
    expect(penTags(text)).toBe('penTags filter: ' + text);
  });

});
