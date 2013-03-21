express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
everyauth = require 'everyauth'
db = require './db.js'

# App config

app = express()

app.configure () ->
  app.pwd = path.dirname(module.uri)
  app.set 'port', process.env.PORT || 3000
  app.set 'views', path.join(app.pwd,'/client/app/views')
  app.engine('.html', require('ejs').renderFile)
  app.set('view engine', 'html');
  app.set 'view options', 
    layout: false
  app.use express.compress()
  app.use express.favicon()
  app.use express.bodyParser()
  app.use express.cookieParser('secretz')
  app.use express.session()
  app.use everyauth.middleware(app)
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(path.join(app.pwd, '/client/app/')) # this might be the wrong dir
  app.use express.logger()

app.get '/', (req, res) -> 
  res.render 'layout'
app.get '/index.html', (req, res) ->
  res.render 'index'

app.listen 3000

console.log 'Go to http://localhost:3000'

module.exports = app


# RESTful end points

angularBridge = new (require 'angular-bridge') app,
  urlPrefix: '/api/'

angularBridge.addResource 'leagues', db.League

# User Auth

everyauth.github
  .appId('2bf1c804756e95d43bec')
  .appSecret('16516757e1d87c3f13802448685375ee04674105')
  .findOrCreateUser((session, accessToken, accessTokenExtra, githubUserMetadata) ->
    console.log githubUserMetadata
  ).redirectPath "/"
