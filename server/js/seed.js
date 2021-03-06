(function() {
  var League, Player, Team, async, db, _;

  db = require('./db');

  _ = require('underscore');

  async = require('async');

  League = db.League;

  Team = db.Team;

  Player = db.Player;

  async.parallel([
    function(callback) {
      return League.remove({}, function(err, result) {
        console.log('leagues cleared');
        return callback(err);
      });
    }, function(callback) {
      return Team.remove({}, function(err, result) {
        console.log('teams cleared');
        return callback(err);
      });
    }, function(callback) {
      return Player.remove({}, function(err, result) {
        console.log('players cleared');
        return callback(err);
      });
    }
  ], function(callback) {
    var items, jasmine, jq, jresig, ncl, players, teams, under;

    console.log('start 2nd block');
    jresig = new Player({
      name: 'John Resig'
    });
    players = [jresig];
    jq = new Team({
      name: 'Team jQuery',
      players: players
    });
    under = new Team({
      name: 'The Underscorchers'
    });
    jasmine = new Team({
      name: 'The Jasminers'
    });
    teams = [jq, under, jasmine];
    ncl = new League({
      name: 'National Codeslingers League',
      teams: teams
    });
    items = [ncl, jq, under, jasmine];
    return async.eachSeries(items, function(x) {
      return x.save(function(err) {
        if (err) {
          throw err;
        }
      });
    }, function(callback) {
      League.find({}, function(err, leagues) {
        return console.log(leagues);
      });
      Team.find({}, function(err, teams) {
        return console.log(teams);
      });
      Player.find({}, function(err, players) {
        return console.log(players);
      });
      return callback(err);
    });
  });

}).call(this);
