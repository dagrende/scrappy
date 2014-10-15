'use strict';

angular.module('scrappyApp')
  .controller('EditCtrl', function ($scope, $routeParams, fbURL, $firebase, fsl) {
    setFullHeight();
    $(window).bind("resize", setFullHeight);
    fsl.$getCurrentUser().then(function(user) {
      $scope.scrap = $firebase(new Firebase(fbURL + '/users/' + user.uid + '/' + $routeParams.scrapId));
    });
    saver($scope);
  })
  .controller('CreateCtrl', function($scope, fsl, $firebase, fbURL) {
    setFullHeight();
    $(window).bind("resize", setFullHeight);
    var dateString = new Date().toISOString();
    $scope.scrap = {text: "", created: dateString, changed: dateString, notebook: ''};
    fsl.$getCurrentUser().then(function(user) {
      var scraps = $firebase(new Firebase(fbURL + '/users/' + user.uid));
      scraps.$add($scope.scrap).then(function(newRef) {
        $scope.scrap = $firebase(new Firebase(fbURL + '/users/' + user.uid + '/' + newRef.name()));
      });
      saver($scope);
    });
  });

function setFullHeight() {
  var newHeight = (window.innerHeight - 70) + 'px';
  $('#tinymce').height(newHeight);
  $('#tinymce_ifr').height(newHeight);
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
        $scope.scrap.updated = new Date().toISOString();
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
