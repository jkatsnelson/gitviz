express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
everyauth = require 'everyauth'
mongoose = require 'mongoose'

mongoose.connect('mongodb://localhost/fantasygithub')
db = mongoose.connection
db.on 'error', console.error.bind console, 'connection error:'
db.once 'open', () ->
  leagueSchema = mongoose.Schema
    name: String
    users: Array
  userSchema = mongoose.Schema
    gitSN: String
    gitInfo: Object
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