'use strict';

angular.module('scrappyApp')
  .controller('EditCtrl', function ($scope, $routeParams, Scraps, fbURL, $firebase) {
    setFullHeight();
    $scope.scrap = $firebase(new Firebase(fbURL + $routeParams.scrapId));
    saver($scope);
  })
  .controller('CreateCtrl', function($scope, Scraps, $firebase, fbURL) {
    setFullHeight();
    $scope.scrap = {text: ""};
    Scraps.$add($scope.scrap).then(function(newRef) {
      $scope.scrap = $firebase(new Firebase(fbURL + newRef.name()));
      saver($scope);
    });
  });

function setFullHeight() {
  $('#tinymce').height((window.innerHeight - 70) + 'px');
}

function saver($scope) {
  var pendingSaves = 0;
  var intervalID = window.setInterval(function () {
    if (pendingSaves == 0) {
      pendingSaves++;
      $scope.scrap.$save().then(function () {
        pendingSaves--;
        console.log('save ok');
      });
    } else {
      if (pendingSaves > 5) {
        console.log('saving problem - pendingSaves=' + pendingSaves);
      }
    }
  }, 3000);
  $scope.$on("$destroy", function () {
    window.clearInterval(intervalID);
  });
}
