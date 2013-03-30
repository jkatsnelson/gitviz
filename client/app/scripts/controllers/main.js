'use strict';

angular.module('githubleagueClientApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
    $scope.leadIn = true;
    $scope.repoFound = false;

    $scope.searchForRepo = function(gitUser, gitRepo) {
      $scope.leadIn = false
      $scope.repoFound = false;
      $scope.findingRepo = true;
      $scope.user = gitUser;
      $scope.repo = gitRepo;
      $http({method: 'GET', url: '/query/' + gitUser + '/repo/' + gitRepo }).
        success(function(data, status, headers, config) {
          $scope.findingRepo = false;
          $scope.repoFound = true;
          $scope.repoHistory = data;
        }).
        error(function(data, status, headers, config) {
          console.log(status);
        });
    };
  });
