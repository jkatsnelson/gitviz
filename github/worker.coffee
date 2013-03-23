GitHubApi = require 'github'
db = require '../js/db.js'
Player = db.Player

github = new GitHubApi
  version: '3.0.0',
  timeout: 5000

# github.repos.getContributors
#   user: 'jashkenas'
#   repo: 'coffee-script'
# , (err, res) ->
#   player = new Player 
#     name: res[0].login
#     data: res[0]
#   player.save (err) ->
#     throw err if err

github.repos.getCommits
  user: 'jashkenas'
  repo: 'coffee-script'
, (err, res) ->
  console.log res