'use strict';

angular.module('scrappyApp')
  .controller('EditCtrl', function ($scope, $routeParams, Scraps, fbURL, $firebase) {
    setFullHeight();
    $scope.scrap = $firebase(new Firebase(fbURL + $routeParams.scrapId));
//    saver($scope);
  })
  .controller('CreateCtrl', function($scope, Scraps, $firebase, fbURL) {
    setFullHeight();
    $scope.scrap = {text: ""};
    Scraps.$add($scope.scrap).then(function(newRef) {
      $scope.scrap = $firebase(new Firebase(fbURL + newRef.name()));
//      saver($scope);
    });
  });

function setFullHeight() {
  $('#tinymce').height((window.innerHeight - 70) + 'px');
}

// saves $scope.scrap to firebase regularily if changed
function saver($scope) {
  var pendingSaves = 0, changeNo = 0, lastSaveNo = 0;
  $scope.$watch(function() {changeNo++});
  var intervalID = window.setInterval(function () {
    if (lastSaveNo < changeNo) {
      if (pendingSaves == 0) {
        pendingSaves++;
        changeNo--;
        $scope.scrap.$save().then(function () {
          pendingSaves--;
          lastSaveNo = changeNo + 1;
        });
      } else {
        if (pendingSaves > 5) {
          console.log('saving problem - pendingSaves=' + pendingSaves);
        }
      }
    }
  }, 3000);
  $scope.$on("$destroy", function () {
    window.clearInterval(intervalID);
    $scope.scrap.$save();
  });
}
