express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
events = require __dirname + '/../../github/js/userEvents.js'
commits = require __dirname + '/../../github/js/repoCommits.js'
app = express()

app.configure () ->
  app.pwd = path.dirname module.uri
  app.set 'port', process.env.PORT || 3000
  app.use express.compress()
  app.use express.favicon()
  app.use express.bodyParser()
  app.use express.cookieParser 'secretz'
  app.use express.session()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static path.join app.pwd, '/client/app/'
  app.use express.logger()

console.log 'Go to http://localhost:3000'

app.get '/query/:user', (req, res) ->

  events.find.on 'events', (events) ->
    res.send events
  events.find.get req.params.user

app.get '/query/:user/repo/:repo', (req, res) ->

  commits.find.on 'commits', (commits) ->
    res.send commits
  commits.find.get req.params.user, req.params.repo

app.listen 3000

module.exports = app