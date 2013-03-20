express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
everyauth = require 'everyauth'

app = express()

everyauth.helpExpress(app)

app.configure () ->
	app.set 'port', process.env.PORT || 3000
	app.use app.router

app.get '/', (req, res) ->
  res.send('hello world')
  # need something like 'res.render index'

http.createServer(app).listen app.get('port'), () ->
	console.log "Express server listening on port #{app.get('port')}"