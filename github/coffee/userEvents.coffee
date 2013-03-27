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
num = 0
find = new EventEmitter

find.getEvents = (user) ->
  console.log user
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
      if nextPage then find.getEvents user
      else
        find.emit 'events', events
        saveEvents events
    else
      find.emit 'events', events

saveEvents = (events) ->
  userEvent = new UserEvent
    user: user
    events: events
  userEvent.save (err) ->
    throw err if err
    db.db.close()

exports.find = find