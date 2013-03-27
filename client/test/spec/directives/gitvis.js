'use strict';

describe('Directive: gitvis', function () {
  beforeEach(module('githubleagueClientApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<gitvis></gitvis>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the gitvis directive');
  }));
});
