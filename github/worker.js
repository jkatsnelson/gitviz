(function() {
  var GitHubApi, Player, db, github;

  GitHubApi = require('github');

  db = require('../js/db.js');

  Player = db.Player;

  github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000
  });

  github.repos.getContributors({
    user: 'jashkenas',
    repo: 'coffee-script'
  }, function(err, res) {
    var player;

    player = new Player({
      name: res[0].login,
      data: res[0]
    });
    return player.save(function(err) {
      if (err) {
        throw err;
      }
    });
  });

}).call(this);
