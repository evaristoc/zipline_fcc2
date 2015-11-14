'use strict';
//http://stackoverflow.com/questions/18967127/angularjs-when-to-pass-scope-variable-to-function
//http://www.java2s.com/Tutorials/AngularJS/AngularJS_Example/Controller/Call_function_in_controller_with_onchange_event.htm
angular.module('ziplineFcc2App')
  .controller('PenCtrl', function ($scope, $http) {
    $scope.message = 'Hello';
    $scope.awesomePens = [];
    $scope.awesomeTags = [];
    //sorting and filtering
    //http://code.ciphertrick.com/2015/06/01/search-sort-and-pagination-ngrepeat-angularjs/
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };    
    $http.get('/api/pens').success(function(awesomePens) {
      $scope.awesomePens = awesomePens[0];
      $scope.awesomeTags = awesomePens[1];
      //console.log(awesomePens[1]);
      //$scope.findTgs = function(pen){
      //  //console.log(pen);
      //  var thetags = [];
      //  pen.forEach(function(tagid){
      //    var atag = awesomePens[1].filter(function(val){
      //      //console.log(val._id, tagid);
      //      return val._id == tagid;
      //    });
      //    console.log(atag);
      //    thetags.push(atag[0])
      //  });
      //  console.log(thetags);
      //  return thetags;
      //};
    });
  });
