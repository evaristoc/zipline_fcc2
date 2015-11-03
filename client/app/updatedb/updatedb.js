'use strict';

angular.module('ziplineFcc2App')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/updatedb', {
        templateUrl: 'app/updatedb/updatedb.html',
        controller: 'UpdatedbCtrl'
      });
  });
