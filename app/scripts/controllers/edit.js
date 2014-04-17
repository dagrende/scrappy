'use strict';

angular.module('scrappyApp')
  .controller('EditCtrl', function ($scope, $routeParams) {
    var setFullHeight = function() {
      $('#tinymce').height((window.innerHeight - 70) + 'px');
    }
    setFullHeight();
//    $(window).bind("resize", setFullHeight);

    var scrapId = $routeParams.scrapId;
    $scope.scrapText = "scrap " + scrapId;
  });
