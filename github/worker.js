(function() {
  var GitHubApi, Repo, db, github;

  GitHubApi = require('github');

  db = require('../js/db.js');

  Repo = db.Repo;

  github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000
  });

  github.repos.getCommits({
    user: 'gavinmcdermott',
    repo: 'rooms'
  }, function(err, res) {
    if (err) {
      throw err;
    }
    return console.log(res);
  });

}).call(this);
