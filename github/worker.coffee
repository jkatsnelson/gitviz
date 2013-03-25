request = require 'request'
db = require '../js/db.js'
gm = require("googlemaps")
util = require("util")
fs = require("fs")

Commit = db.Commit

repoName = 'coffee-script'
author = 'jashkenas'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
repoURL = 'https://api.github.com/repos/'+author+'/'+repoName+'/commits'
userURL = 'https://api.github.com/users/'
locations = {}

getCommits = (url) ->
  request.get url, (err, res, body) ->
    throw err if err  
    commitList = JSON.parse body
    unless res.headers.link
      console.log "Commit list is only one page long."
      return traverseList commitList
    if res.headers.link.split(";").length > 2
      # if there is a next page, move to next page of the commit list
      traverseList commitList, res.headers.link.split("<")[1].split(">")[0]
    else
      traverseList commitList && console.log "List ended."

traverseList = (commitList, nextPage) ->
  unless nextPage
    nextPage = null
  unless commitList
    commitList = []
  if commitList.length
    unless commitList[0].author
      commitList[0].author = login: 'not specified'
    contributor = commitList[0].author.login
    if locations[contributor] then saveCommit commitList.shift(), commitList, nextPage
    else fetchLocation contributor, commitList, nextPage
  else
    if nextPage then getCommits nextPage else console.log 'done saving.'

fetchLocation = (contributor, commitList, nextPage) ->
  request.get userURL + contributor + auth, (err, res, body) ->
    throw err if err
    user = JSON.parse body
    unless user.location
      user.location = "Not specified"
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
      traverseList commitList, nextPage

saveCommit = (commit, commitList, nextPage) ->
  newCommit = new Commit
    repo: author + '/' + repoName
    contributor: commit.author.login
    message: commit.commit.message
    date: commit.commit.author.date
    location : locations[commit.author.login]
  newCommit.save (err) ->
    throw err if err
    traverseList commitList, nextPage

getCommits(repoURL+auth)