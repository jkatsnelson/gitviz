'use strict';
angular.module('mongolab', ['ngResource']).factory('League', function ($resource) {
    var League = $resource('https://api.mongolab.com/api/1/databases' +
      '/fantasygithub/collections/leagues/:id',
      { apiKey: 'QD0CaK5zQiUuFAGbJ3o-7WkkJR5u9qb0'}, {
        update: { method: 'PUT' }
      }
    );
    League.prototype.update = function (cb) {
      return League.update({id: this._id.$oid},
        angular.extend({}, this, {_id: undefined}), cb);
    };
    League.prototype.destroy = function (cb) {
      return League.remove({id: this._id.$oid}, cb);
    };
    return League;
  }).factory('Team', function ($resource) {
    var Team = $resource('https://api.mongolab.com/api/1/databases' +
      '/fantasygithub/collections/teams/:id',
      { apiKey: 'QD0CaK5zQiUuFAGbJ3o-7WkkJR5u9qb0'}, {
        update: { method: 'PUT' }
      }
    );
    Team.prototype.update = function (cb) {
      return Team.update({id: this._id.$oid},
        angular.extend({}, this, {_id: undefined}), cb);
    };
    Team.prototype.destroy = function (cb) {
      return Team.remove({id: this._id.$oid}, cb);
    };
    return Team;
  }).factory('Player', function ($resource) {
    var Player = $resource('https://api.mongolab.com/api/1/databases' +
      '/fantasygithub/collections/players/:id',
      { apiKey: 'QD0CaK5zQiUuFAGbJ3o-7WkkJR5u9qb0'}, {
        update: { method: 'PUT' }
      }
    );
    Player.prototype.update = function (cb) {
      return Player.update({id: this._id.$oid},
        angular.extend({}, this, {_id: undefined}), cb);
    };
    Player.prototype.destroy = function (cb) {
      return Player.remove({id: this._id.$oid}, cb);
    };
    return Player;
  });