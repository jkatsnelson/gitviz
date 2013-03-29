'use strict';

angular.module('githubleagueClientApp')
  .controller('PersonSearchCtrl', function($scope, $routeParams, $http) {
    $scope.personReady = false;
    $scope.firstSearch = true;
    $scope.beyondFirstSearch = false;

    var createDateTypeObjects = function(gitEvents) {
      var dtObjs = _(gitEvents).map(function(e) { return { "creation": e.created_at, "type": e.type } });
      _(dtObjs).each(function(obj) {
        var timeStamp = Date.parse(obj.creation);
        var newTime = new Date(timeStamp);
        if (newTime.getUTCHours() >= 6 && newTime.getUTCHours() <= 17) {
          obj['persona'] = 'dayTripper';
        } else {;
          obj['persona'] = 'nightOwl';
        }
      });
      return dtObjs;
    };

    $scope.searchForUser = function(gitUser) {
      $scope.personReady = false;
      $scope.firstSearch = false;
      $scope.beyondFirstSearch = true;
      $scope.findingPlayer = true;
      $http({method: 'GET', url: '/query/'+ gitUser }).
        success(function(data, status, headers, config) {
          $scope.events = createDateTypeObjects(data);
          // console.log(data);
          $scope.findingPlayer = false;
          $scope.personReady = true;
        }).
        error(function(data, status, headers, config) {
          console.log(status);
        });
    };

    // $scope.searchForRepo = function(gitUser, gitRepo) {
    //   $scope.repoReady = false;
    //   $scope.findingRepo = true;
    //   $http({method: 'GET', url: '/query/' + gitUser + '/repo/' + gitRepo }).
    //     success(function(data, status, headers, config) {
    //       $scope.findingRepo = false;
    //       $scope.repoReady = true;
    //     }).
    //     error(function(data, status, headers, config) {
    //       console.log(status);
    //     });
    // };
  });
