'use strict';

angular.module('scrappyApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, $firebase, $firebaseSimpleLogin, fbref, fsl) {
    $scope.auth = fsl;

    fsl.$getCurrentUser().then(function(d) {
      if (d) {
        $timeout(function() {window.location.href = "#/list"});
      }
    });

    $scope.email = "dag.rende@gmail.com";
    $scope.pw = '';
    $scope.login = function (serviceProvider, data) {
      if (['google', 'github', 'password'].indexOf(serviceProvider) != -1) {
        $scope.auth.$login(serviceProvider, data)
        .then(function (user) {
          console.log("logged in: ", user);
          $timeout(function() {$rootScope.$apply(); window.location.href = "#/list"});
        }, function(error) {
          console.error("Login failed: " + error);
        });
      }
    };
  });
