GitHubApi = require 'github'

github = new GitHubApi
  version: '3.0.0',
  timeout: 5000

github.user.getFollowingFromUser
  user: 'mikedeboer'
, (err, res) ->
  console.log JSON.stringify res