'use strict';

angular.module('scrappyApp')
  .controller('MainCtrl', function ($scope, Scraps) {
    $scope.scraps = Scraps;

    $scope.remove = function(scrapId) {
      Scraps.$remove(scrapId);
    };
  });
