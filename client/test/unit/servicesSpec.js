'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('fantasyGit.services'));


  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
