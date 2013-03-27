'use strict';

angular.module('githubleagueClientApp')
  .controller('PersonSearchCtrl', function ($scope, $routeParams, $http) {
    // $scope.teamName = $routeParams.teamName;
    $scope.personReady = false;

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

    var createDateTypeObjects = function (gitEvents) {
      var dtObjs = _(gitEvents).map(function (e) { return { "creation": e.created_at, "type": e.type } });
      _(dtObjs).each(function (obj) {
        var timeStamp = Date.parse(obj.creation);
        var newTime = new Date(timeStamp);
        if (newTime.getUTCHours() >= 6 && newTime.getUTCHours() <= 17) {
          obj['persona'] = 'dayTripper';
        } else {
          obj['persona'] = 'nightOwl';
        }
      });
      return dtObjs;
    };

    $scope.searchForUser = function (gitUser) {
      $http({method: 'GET', url: '/query/'+ gitUser }).
        success(function (data, status, headers, config) {
          console.log(gitUser);
          $scope.events = createDateTypeObjects(data);
          $scope.personReady = true;
        }).
        error(function (data, status, headers, config) {
          console.log(gitUser);
        });
    };

    $scope.searchForRepo = function (gitUser, gitRepo) {
      $http({method: 'GET', url: '/query/' + gitUser + '/repo/' + gitRepo }).
        success(function (data, status, headers, config) {
          console.log(gitRepo);
          console.log(data)
        }).
        error(function (data, status, headers, config) {
          console.log(data);
          console.log("error");
        });
    };
  });
