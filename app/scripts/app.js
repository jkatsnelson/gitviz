'use strict';

angular.module('githubleagueClientApp', ['mongolab'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/repos', {
        templateUrl: 'views/repos-index.html',
        controller: 'ReposIndexCtrl'
      })
      .when('/people', {
        templateUrl: 'views/person-search.html',
        controller: 'PersonSearchCtrl'
      })
      .when('/people/:personId', {
        templateUrl: 'views/person-show.html',
        controller: 'PersonCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
