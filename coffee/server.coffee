express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
everyauth = require 'everyauth'
db = require './db.js'

app = express()

app.configure () ->
	app.set 'port', process.env.PORT || 3000
	app.use app.router

app.use("/", express.static(__dirname + '/../client/app/'))

http.createServer(app).listen app.get('port'), () ->
	console.log "Express server listening on port #{app.get('port')}"