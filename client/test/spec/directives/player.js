'use strict';

describe('Directive: player', function () {
  beforeEach(module('githubleagueClientApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<player></player>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the player directive');
  }));
});
