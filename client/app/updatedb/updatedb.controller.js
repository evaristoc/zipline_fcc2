'use strict';

angular.module('ziplineFcc2App')
  .controller('UpdatedbCtrl', function ($scope, $http) {
    $scope.message = 'Hello';
    $http.get('/api/updatedb').then(function(data){console.log(data)})
  });
