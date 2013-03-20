'use strict';

var app = angular.module('angularjs-starter', []);

angular.module('fantasyGit', []).
  config(['$routeProvider', '$compileProvider' , function($routeProvider, $compileProvider) {

  $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  $routeProvider.
    when('/', {templateUrl: 'index.html',   controller: SignInController}).
    when('/users/:userId', {templateUrl: './users/show.html', controller: UserShowController}).
    when('/teams/:teamId', {templateUrl: './teams/show.html', controller: TeamShowController}).
    otherwise({redirectTo: '/'});
}]);