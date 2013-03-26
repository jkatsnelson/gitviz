express = require 'express'
routes = require 'routes'
http = require 'http'
path = require 'path'
github = require '/github/js/userEvents.js'
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
  app.use express.static path.join app.pwd, '/app/'
  app.use express.logger()

app.listen 3000

console.log 'Go to http://localhost:3000'

app.get 'query/:user', (req, res, user) ->
  github.query user
  github.on 'retrieved', (data) ->
    res.send data

module.exports = app