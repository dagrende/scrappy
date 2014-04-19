'use strict';

angular.module('scrappyApp')
.controller('MainCtrl', function ($scope, Scraps) {
  $scope.scraps = Scraps;

  $scope.getLabel = function(s) {
    // returns content with all html tags (including attributes) replaced by spaces
    return s.replace(/<[^>]+>/g, ' ');
  };
  $scope.remove = function(scrapId) {
    Scraps.$remove(scrapId);
  };
});
