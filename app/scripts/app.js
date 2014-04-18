'use strict';

angular.module('scrappyApp', [
  'ui.tinymce',
  'ngRoute',
  'firebase'
])
.value('fbURL', 'https://scrappy.firebaseIO.com/')
.factory('Scraps', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
})
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
    .when('/new', {
      templateUrl: 'views/edit.html',
      controller: 'CreateCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
;
