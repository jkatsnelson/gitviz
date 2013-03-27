'use strict';

describe('Controller: TeamCtrl', function () {

  // load the controller's module
  beforeEach(module('githubleagueClientApp'));

  var TeamCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    TeamCtrl = $controller('TeamCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
