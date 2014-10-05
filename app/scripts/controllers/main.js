'use strict';

angular.module('scrappyApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, Scraps, $firebaseSimpleLogin, fbref) {
    $scope.scraps = Scraps;
    $scope.auth = $firebaseSimpleLogin(fbref);

    $scope.email = "dag.rende@gmail.com";
    $scope.pw = '';
    $scope.login = function () {
      $scope.auth.$login('password', {email: $scope.email, password: $scope.pw})
      .then(function (user) {
        console.log("logged in: ", user);
        $timeout(function() {$rootScope.$apply()});
      }, function(error) {
        console.error("Login failed: " + error);
      });
    };
    $scope.getLabel = function (s) {
      // returns content with all html tags (including attributes) replaced by spaces
      return s.replace(/<[^>]+>/g, ' ').substring(0, 40);
    };
    $scope.remove = function (scrapId) {
      Scraps.$remove(scrapId);
    };
  });
