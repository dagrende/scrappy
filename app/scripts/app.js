'use strict';

angular.module('scrappyApp', [
  'ui.tinymce',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
