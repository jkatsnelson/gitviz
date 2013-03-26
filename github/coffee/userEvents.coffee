request = require 'request'
db = require '../../js/db.js'
_ = require 'underscore'
httpLink = require 'http-link'

UserEvent = db.UserEvent

user = 'jkatsnelson'
rootURL = 'https://api.github.com/users/'
eventsURL = '/events/public'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
nextPage = null

query = (user) ->
  user = user
  getEventsAndReturn rootURL + user + eventsURL + auth
  getEventsAndSave rootURL + user + eventsURL + auth

getEventsAndReturn = (url) ->
  if url
  else console.log "done"
getEventsAndSave = (url) ->
  if url
    request.get url, (err, res, body) ->
      throw err if err
      links = httpLink.parse res.headers.link
      eventList = JSON.parse body
      nextPage = null
      _.each links, (link) ->
        if link.rel is 'next' then nextPage = link.href
        else return
      if nextPage
        traverseList eventList, nextPage
      else
        traverseList eventList

traverseList = (list) ->
  if list.length
    saveEvent list.shift(), list, nextPage
  else
    getEventsAndSave nextPage

saveEvent = (listItem, list) ->
  userEvent = new UserEvent
    user: user
    event: listItem
  userEvent.save (err) ->
    throw err if err
    traverseList list
getEventsAndSave rootURL + user + eventsURL + auth