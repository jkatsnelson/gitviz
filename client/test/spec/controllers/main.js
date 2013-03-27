'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('githubleagueClientApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of leaders to the scope', function () {
    expect(scope.leaderBoard.length).toBe(3);
  });
});
