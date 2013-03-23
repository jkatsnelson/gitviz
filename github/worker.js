(function() {
  var GitHubApi, Player, db, github;

  GitHubApi = require('github');

  db = require('../js/db.js');

  Player = db.Player;

  github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000
  });

  github.repos.getCommits({
    user: 'jashkenas',
    repo: 'coffee-script'
  }, function(err, res) {
    return console.log(res);
  });

}).call(this);
