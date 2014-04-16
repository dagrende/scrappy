'use strict';

angular.module('scrappyApp')
  .controller('EditCtrl', function ($scope, $routeParams) {
    var scrapId = $routeParams.scrapId;
    $scope.scrapText = "scrap " + scrapId;
  });
