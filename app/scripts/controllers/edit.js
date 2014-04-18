'use strict';

angular.module('scrappyApp')
  .controller('EditCtrl', function ($scope, $routeParams, Scraps, fbURL, $firebase) {
    setFullHeight();
    $scope.scrap = $firebase(new Firebase(fbURL + $routeParams.scrapId));
    $scope.$on("$destroy", function(){
      $scope.scrap.$save();
    });
  })
  .controller('CreateCtrl', function($scope, Scraps, $firebase, fbURL) {
    setFullHeight();
    $scope.scrap = {text: "Hej"};
    Scraps.$add($scope.scrap).then(function(newRef) {
      $scope.scrap = $firebase(new Firebase(fbURL + newRef.name()));
      $scope.$on("$destroy", function(){
        $scope.scrap.$save();
      });
    });
  });

function setFullHeight() {
  $('#tinymce').height((window.innerHeight - 70) + 'px');
}
