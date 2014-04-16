'use strict';

angular.module('scrappyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.scraps = [{text:"hej du glade", $id:"1"}, {text:"tag en spade", $id:"2"}, {text:"och gräv ned dig", $id:"3"}];

    $scope.edit = function(scrapId) {
      window.currentScrapId  = scrapId;
      window.location.href = "#/edit/" + scrapId;
      console.log(window.location.href);
    };
  });
