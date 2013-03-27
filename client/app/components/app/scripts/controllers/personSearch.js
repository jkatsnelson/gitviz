'use strict';

angular.module('githubleagueClientApp')
  .controller('PersonSearchCtrl', function ($scope, $routeParams, $http) {
    // $scope.teamName = $routeParams.teamName;
    $scope.people = [
      {
        'id': '123',
        'first': 'jim',
        'last': 'jones'
      },
      {
        'id': '2343',
        'first': 'mike',
        'last': 'ronson'
      },
      {
        'id': '8',
        'first': 'bobby',
        'last': 'strings'
      }
    ];

    $scope.searchForUser = function(gitUser) {
      $http({method: 'GET', url: '/query/'+ gitUser }).
        success(function(data, status, headers, config) {
          console.log(gitUser);
        }).
        error(function(data, status, headers, config) {
          console.log(gitUser);
        });
    }
  });
