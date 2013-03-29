request = require 'request'
db = require __dirname+'/../../server/js/db.js'
_ = require 'underscore'
httpLink = require 'http-link'
EventEmitter = require('events').EventEmitter

UserEvent = db.UserEvent

rootURL = 'https://api.github.com/users/'
eventsURL = '/events/public'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
nextPage = null
events = []
user = null

init = () ->
  events = []
  nextPage = null
  user = null
  eventMaker = new EventEmitter
  eventMaker.init = init
  eventMaker.get = get
  return eventMaker

get = (user) ->
  user = user
  that = @
  url = rootURL + user + eventsURL + auth
  if nextPage then url = nextPage
  request.get url, (err, res, body) ->
    throw err if err
    if res.headers.link
      links = httpLink.parse res.headers.link
      events = events.concat JSON.parse body
      nextPage = null
      _.each links, (link) ->
        if link.rel is 'next' then nextPage = link.href
        else return
      if nextPage then that.get user
      else
        that.emit 'events', events
        saveEvents events
    else
      that.emit 'events', events

saveEvents = (events) ->
  userEvent = new UserEvent
    user: user
    events: events
  userEvent.save (err) ->
    throw err if err
    db.db.close()

exports.init = init