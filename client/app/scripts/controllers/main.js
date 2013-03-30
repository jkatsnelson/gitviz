'use strict';

angular.module('githubleagueClientApp')
  .controller('MainCtrl', function ($scope, $routeParams, $http) {
    $scope.repoFound = false;

    $scope.searchForRepo = function(gitUser, gitRepo) {

      $scope.repoFound = false;
      $scope.findingRepo = true;
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
