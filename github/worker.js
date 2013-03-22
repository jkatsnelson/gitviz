(function() {
  var GitHubApi, db, github;

  GitHubApi = require('github');

  db = require('js/db.js');

  github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000
  });

  db.once('open', function() {
    console.log("WAHAT UP");
    return github.user.getFollowingFromUser({
      user: 'mikedeboer'
    }, function(err, res) {
      return console.log(JSON.stringify(res));
    });
  });

}).call(this);
