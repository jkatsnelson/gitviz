express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
userEvents = require __dirname + '/../../github/js/userEvents.js'
getCommits = require __dirname + '/../../github/js/repoCommits.js'
db = require __dirname + '/../../server/js/db.js'

app = express()
# app locals
app.configure () ->
  app.pwd = path.dirname module.uri
  app.set 'port', process.env.PORT || 3000
  app.use express.compress()
  app.use express.favicon()
  app.use express.bodyParser()
  app.use express.cookieParser 'secretz'
  app.use express.methodOverride()
  app.use app.router
  app.use express.static path.join app.pwd, '/client/app/'
  app.use express.logger()

console.log 'Go to http://localhost:3000'

app.get '/query/:user', (req, res) ->
  userEvents = userEvents.init()
  userEvents.on 'events', (events) ->
    res.send events
  userEvents.get req.params.user

app.get '/query/:user/repo/:repo', (req, res) ->
  repoRoute = req.params.user + '/' + req.params.repo
  db.Commit.findOne { 'repo': repoRoute }, 'commits', (err, commitList) ->
    throw err if err
    if commitList
      res.send commitList.commits
    else
      res.write '['
      commitStream = getCommits.init()
      commitStream.on 'commit', (commit) ->
        res.write commit
      commitStream.on 'end', (string) ->
        res.end ']'
      commitStream.get req.params.user, req.params.repo

app.listen 3000

module.exports = app