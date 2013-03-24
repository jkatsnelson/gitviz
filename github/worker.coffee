request = require 'request'
db = require '../js/db.js'

Commit = db.Commit

repoName = 'deface-meteor'
author = 'jkatsnelson'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
repoURL = 'https://api.github.com/repos/'+author+'/'+repoName+'/commitList'

getCommits = (url) ->
  request.get url, (err, res, body) ->
    throw err if err  
    commitList = JSON.parse body
    console.log res
    unless res.headers.link
      console.log "Commit list is only one page long."
      return saveToDB commitList
    if res.headers.link.split(";").length > 2
      # move to next page of the commit list
      saveToDB commitList, res.headers.link.split("<")[1].split(">")[0]
    else
      saveToDB commitList
      console.log "List ended."
saveToDB = (commitList, nextPage) ->
  if commitList.length
    commitObject = commitList.pop()
    commit = new Commit
      repo: author + '/' + repoName
      contributor: commitObject.author
      message: commitObject.commit.message
      date: commitObject.author.date
    commit.save (err) ->
      throw err if err
      saveToDB commitList
  else
    if nextPage then getCommits nextPage else console.log 'done saving.'

getCommits(repoURL+auth)