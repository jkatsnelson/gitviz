GitHubApi = require 'github'
db = require '../js/db.js'
Repo = db.Repo

github = new GitHubApi
	version: '3.0.0',
	timeout: 5000

github.repos.getCommits
  user: 'jashkenas'
  repo: 'coffee-script'
, (err, res) ->
  throw err if err
  console.log typeof res.meta.link
  repo = new Repo
    name: 'coffee-script'
    commits: res
  repo.save (err) ->
    console.log "saved"
    throw err if err