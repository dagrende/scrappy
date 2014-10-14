'use strict';

angular.module('scrappyApp', [
  'ui.tinymce',
  'ngRoute',
  'firebase'
])
  .value('fbURL', 'https://scrappy.firebaseio.com/')
  .service('fbref', function (fbURL) {
    return new Firebase(fbURL);
  })
  .service('fsl', function($firebaseSimpleLogin, fbref, $timeout) {
    var fsl = $firebaseSimpleLogin(fbref);
    return fsl;
  })
  .directive("ngFilesSelect",function(){
    return {
      link: function($scope, el){
        el.bind("change", function(e){
          $scope.getFiles((e.srcElement || e.target).files);
        })      
      }
    }
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl'
      })
      .when('/new', {
        templateUrl: 'views/edit.html',
        controller: 'CreateCtrl'
      })
      .when('/edit/:scrapId', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
