'use strict';
//http://www.w3schools.com/angular/angular_filters.asp
angular.module('ziplineFcc2App')
  .filter('penTags', [function (tags) {
    return function (input) {
      return 'penTags filter: ' + input;
    };
  }]);
