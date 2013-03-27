'use strict';

angular.module('githubleagueClientApp')
  .controller('PersonCtrl', function ($scope, $routeParams) {
    $scope.playerId = $routeParams.playerId;

    $scope.player = {
      'first': 'Maximus',
      'middle': 'Decimus',
      'last': 'Meridius',
      'team': 'Angularites',
      'commits': 23,
      'sloc': 4567
    };
  });