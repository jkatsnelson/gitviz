(function() {
  var GitHubApi, github;

  GitHubApi = require('github');

  github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000
  });

  github.user.getFollowingFromUser({
    user: 'mikedeboer'
  }, function(err, res) {
    return console.log(JSON.stringify(res));
  });

}).call(this);
