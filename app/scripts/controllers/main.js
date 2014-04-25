'use strict';

angular.module('scrappyApp')
  .controller('MainCtrl', ['$scope', '$rootScope', 'Scraps', '$firebaseAuth', 'fbref', 'auth', function ($scope, $rootScope, Scraps, $firebaseAuth, fbref, auth) {
    console.log("1");
    $scope.scraps = Scraps;
    $scope.auth = auth;

    $scope.email = "dag.rende@gmail.com";
    $scope.pw = '';
    $scope.login = function () {
      auth.$login('password', {email: $scope.email, password: $scope.pw}).then(function (user) {
        console.log("logged in: ", user);
      });
    };
    $scope.getLabel = function (s) {
      // returns content with all html tags (including attributes) replaced by spaces
      return s.replace(/<[^>]+>/g, ' ').substring(0, 40);
    };
    $scope.remove = function (scrapId) {
      Scraps.$remove(scrapId);
    };
  }]);
