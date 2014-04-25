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
  .factory('Scraps', function ($firebase, fbURL, fbref) {
    return $firebase(fbref);
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
