'use strict';

angular.module('ziplineFcc2App')
  .controller('PenCtrl', function ($scope, $http) {
    $scope.message = 'Hello';
    $scope.awesomePens = [];
    $scope.awesomeTags = [];
    $http.get('/api/pens').success(function(awesomePens) {
      $scope.awesomePens = awesomePens[0];
      $scope.awesomeTags = awesomePens[1];
      var findTgs = function(pen){
        return pen.tags.forEach(function(tagid){
          awesomePens[1].
        });
      }
    });
  });
