GitHubApi = require 'github'
db = require '../js/db.js'
Player = db.Player

github = new GitHubApi
	version: '3.0.0',
	timeout: 5000

github.repos.getCommits
  user: 'jashkenas'
  repo: 'coffee-script'
, (err, res) ->
  repo = new Repo
    name: 'coffee-script'
    commits: res
  repo.save (err) ->
    throw err if err