request = require 'request'
db = require __dirname + '/../../server/js/db.js'
gm = require("googlemaps")
util = require("util")
fs = require("fs")
httpLink = require 'http-link'
_ = require 'underscore'

Commit = db.Commit

repoName = 'fantasygithub'
author = 'jkatsnelson'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
repoURL = 'https://api.github.com/repos/'+author+'/'+repoName+'/commits'
userURL = 'https://api.github.com/users/'
locations = {}
nextPage = null
save = 0

getCommits = (url) ->
  if url
    request.get url, (err, res, body) ->
      throw err if err  
      nextPage = null
      commitList = JSON.parse body
      unless res.headers.link
        return traverseList commitList
      links = httpLink.parse res.headers.link
      _.each links, (link) ->
        if link.rel is 'next' then nextPage = link.href
        else return
      traverseList commitList
  else throw console.error "done"

traverseList = (commitList) ->
  if commitList.length
    unless commitList[0].author
      commitList[0].author = login: 'not specified'
    contributor = commitList[0].author.login
    if locations[contributor] then saveCommit commitList.shift(), commitList
    else fetchLocation contributor, commitList
  else
    if nextPage then getCommits nextPage else console.log 'done saving.'

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
        locations[contributor] =
          userInput: user.location
          city: data.results[0].formatted_address
          lat: data.results[0].geometry.location.lat
          lon: data.results[0].geometry.location.lng
      else locations[contributor] = city: user.location
      console.log locations[contributor]
      traverseList commitList

saveCommit = (commit, commitList) ->
  newCommit = new Commit
    repo: author + '/' + repoName
    contributor: commit.author.login
    message: commit.commit.message
    date: commit.commit.author.date
    location : locations[commit.author.login]
  newCommit.save (err) ->
    throw err if err
    traverseList commitList

getCommits repoURL+auth