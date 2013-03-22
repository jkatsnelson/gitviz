GitHubApi = require 'github'
db = require 'js/db.js'

github = new GitHubApi
  version: '3.0.0',
  timeout: 5000

db.once 'open', ->
  console.log "WAHAT UP"
  github.user.getFollowingFromUser
    user: 'mikedeboer'
  , (err, res) ->
    console.log JSON.stringify res