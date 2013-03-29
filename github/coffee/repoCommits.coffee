request = require 'request'
db = require __dirname + '/../../server/js/db.js'
gm = require 'googlemaps'
fs = require 'fs'
httpLink = require 'http-link'
_ = require 'underscore'
EventEmitter = require('events').EventEmitter

Commit = db.Commit

auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
repoURL = 'https://api.github.com/repos/'
userURL = 'https://api.github.com/users/'

fantasyGithub = {}

reset = () ->
  fantasyGithub.locations = {}
  fantasyGithub.commits = []
  fantasyGithub.nextPage = null
  fantasyGithub.repoName = null
  fantasyGithub.repoAuthor = null
  fantasyGithub.currentRequest = null
  fantasyGithub.page = 0
  fantasyGithub.firstCommit = true

init = () ->
  reset()
  eventMaker = new EventEmitter
  eventMaker.init = init
  eventMaker.get = get
  return eventMaker

get = (author, repo) ->
  fantasyGithub.currentRequest = @
  if author
    fantasyGithub.repoAuthor = author
    fantasyGithub.repoName = repo
    url = repoURL + author + '/' + repo + '/commits' + auth
  if fantasyGithub.nextPage then url = fantasyGithub.nextPage
  request.get url, (err, res, body) ->
    throw err if err
    fantasyGithub.nextPage = null
    commitList = JSON.parse body
    unless res.headers.link
      return traverseList commitList
    _(httpLink.parse res.headers.link).each (link) ->
      if link.rel is 'next'
        fantasyGithub.nextPage = link.href
        console.log fantasyGithub.page++
      else return
    traverseList commitList

traverseList = (commitList) ->
  if commitList.length
    unless commitList[0].author
      commitList[0].author = login: 'not specified'
    contributor = commitList[0].author.login
    if fantasyGithub.locations.contributor then pushCommit commitList.shift(), commitList
    else fetchLocation contributor, commitList
  else
    if fantasyGithub.nextPage then fantasyGithub.currentRequest.get()
    else
      saveCommits fantasyGithub.commits

fetchLocation = (contributor, commitList) ->
  request.get userURL + contributor + auth, (err, res, body) ->
    throw err if err
    user = JSON.parse body
    unless user.location
      user.location = "Antartica"
    # get lat long for google maps
    gm.geocode user.location, (err, data) ->
      throw err if err
      if data.status is "OK"
        fantasyGithub.locations.contributor =
          userInput: user.location
          city: data.results[0].formatted_address
          lat: data.results[0].geometry.location.lat
          lon: data.results[0].geometry.location.lng
      else locations[contributor] = city: user.location
      traverseList commitList

pushCommit = (commit, commitList) ->
  newCommit =
    repo: fantasyGithub.repoAuthor + '/' + fantasyGithub.repoName
    contributor: commit.author.login
    message: commit.commit.message
    date: commit.commit.author.date
    location : fantasyGithub.locations[commit.author.login]
  fantasyGithub.commits.push newCommit
  if fantasyGithub.firstCommit
    commit = JSON.stringify newCommit
  else
    commit = ',' + JSON.stringify newCommit
  fantasyGithub.currentRequest.emit 'commit', commit.locatioon
  fantasyGithub.firstCommit = false
  traverseList commitList

saveCommits = (commits) ->
  fantasyGithub.currentRequest.emit 'end', 'done!'
  newCommit = new Commit
    repo: fantasyGithub.repoAuthor + '/' + fantasyGithub.repoName
    commits: commits
  newCommit.save (err) ->
    throw err if err
    console.log 'saved '+ fantasyGithub.repoAuthor + '/' + fantasyGithub.repoName
    db.db.close()

exports.init = init