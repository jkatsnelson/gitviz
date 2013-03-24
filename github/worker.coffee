request = require 'request'
db = require '../js/db.js'
Repo = db.Repo

repoName = 'coffee-script'
author = 'jashkenas'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
repoURL = 'https://api.github.com/repos/'+author+'/'+repoName+'/commits'

pageNum = 0

getLinkedList = (url) ->
  pageNum++
  repo = new Repo
    repo: repoName
    author: author
    page: pageNum
  request.get url, (err, res, body) ->
    throw err if err
    repo.commits = body
    repo.save (err, repo) ->
      throw err if err     
      if res.headers.link
        if res.headers.link.split(";").length > 2
          console.log pageNum
          nextLink = res.headers.link.split("<")[1].split(">")[0]
          getLinkedList(nextLink)
        else
          throw "List ended. Done saving. Last doc pageNum is " + pageNum
      else
        throw "Done saving, last doc pageNum is " + pageNum
getLinkedList(repoURL+auth)