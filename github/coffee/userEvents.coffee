request = require 'request'
db = require __dirname+'/../../server/js/db.js'
_ = require 'underscore'
httpLink = require 'http-link'
EventEmitter = require('events').EventEmitter
util = require 'util'

UserEvent = db.UserEvent

user = 'jkatsnelson'
rootURL = 'https://api.github.com/users/'
eventsURL = '/events/public'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
nextPage = null
events = []

getEvents = (user) ->
  that = @
  url = rootURL + user + eventsURL + auth
  request.get url, (err, res, body) ->
    throw err if err
    links = httpLink.parse res.headers.link
    events = events.concat JSON.parse body
    nextPage = null
    _.each links, (link) ->
      if link.rel is 'next' then nextPage = link.href
      else return
    if nextPage
      getEvents nextPage
    else
      that.emit 'events', events
      saveEvents events

util.inherits getEvents, EventEmitter

saveEvents = (events) ->
  userEvent = new UserEvent
    user: user
    event: events
  userEvent.save (err) ->
    throw err if err
    db.db.close()

exports.getEvents = getEvents