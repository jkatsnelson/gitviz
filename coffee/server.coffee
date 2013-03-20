express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
everyauth = require 'everyauth'
db = require './db.js'

angularBridge = new (require 'angular-bridge') app,
  urlPrefix : '/api/'

angularBridge.addResource 'leagues', db.League

app = express()

app.configure () ->
	app.set 'port', process.env.PORT || 3000
	app.use app.router

app.get '/', (req, res) ->
  res.send('hello world')
  # need something like 'res.render index'

http.createServer(app).listen app.get('port'), () ->
	console.log "Express server listening on port #{app.get('port')}"