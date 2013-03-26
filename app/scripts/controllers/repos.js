'use strict';

angular.module('githubleagueClientApp')
  .controller('ReposIndexCtrl', function ($scope, $routeParams) {
    $scope.teams = [
      {
        'name': 'HTML5 Badoingadoings',
        'players': [
          {
            'id': '123',
            'first': 'jim',
            'last': 'jones'
          },
          {
            'id': '2343',
            'first': 'mike',
            'last': 'ronson'
          }
        ]
      },
      {
        'name': 'Angular Agents of Rock',
        'players': [
          {
            'id': '123',
            'first': 'jim',
            'last': 'jones'
          },
          {
            'id': '2343',
            'first': 'mike',
            'last': 'ronson'
          }
        ]
      },
      {
        'name': 'Karma Koders',
        'players': [
          {
            'id': '123',
            'first': 'jim',
            'last': 'jones'
          },
          {
            'id': '2343',
            'first': 'mike',
            'last': 'ronson'
          }
        ]
      }
    ];

    window.teams = $scope.teams;
  });
