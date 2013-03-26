request = require 'request'
db = require '../../js/db.js'
_ = require 'underscore'
httpLink = require 'http-link'
RepoEvent = db.RepoEvent

owner = 'jkatsnelson/'
repo = 'fantasygithub'
rootURL = 'https://api.github.com/repos/'
eventsURL = '/events'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
num = 0
nextPage = null

getEvents = (url) ->
  if url
    console.log url
    request.get url, (err, res, body) ->
      throw err if err
      console.log res.headers
      eventList = JSON.parse body
      unless res.headers.link
        return traverseList eventList
      links = httpLink.parse res.headers.link
      nextPage = null
      _.each links, (link) ->
        if link.rel is 'next' then nextPage = link.href
        else return
      traverseList eventList
  else throw console.error "done"

traverseList = (list) ->
  if list.length
    saveEvent list.shift(), list, nextPage
  else
    getEvents nextPage

saveEvent = (listItem, list) ->
  num++
  repoEvent = new RepoEvent
    repo: owner + repo
    event: listItem
  repoEvent.save (err) ->
    throw err if err
    console.log "went into save loop " + num
    traverseList list
getEvents rootURL + owner + repo + eventsURL + auth