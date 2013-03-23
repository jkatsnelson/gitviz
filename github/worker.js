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
    user: 'jashkenas',
    repo: 'coffee-script'
  }, function(err, res) {
    var repo;

    if (err) {
      throw err;
    }
    console.log(typeof res.meta.link);
    repo = new Repo({
      name: 'coffee-script',
      commits: res
    });
    return repo.save(function(err) {
      console.log("saved");
      if (err) {
        throw err;
      }
    });
  });

}).call(this);
