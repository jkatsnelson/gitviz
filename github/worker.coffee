request = require 'request'
db = require '../js/db.js'
Repo = db.Repo

repoName = 'deface-meteor'
author = 'jkatsnelson'
auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105'
repoURL = 'https://api.github.com/repos/'+author+'/'+repoName+'/commits'

pageNum = 0

getLinkedList = (url) ->
  res = null
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
# LINK LENGTH MUST BE VERIFIED AS APPROPRIATE FOR HAVING A NEXT 
      if res.headers.link
        console.log pageNum
        nextLink = res.headers.link.split("<")[1].split(">")[0]
        console.log nextLink
        getLinkedList(nextLink)
      else
        throw "Done saving, last doc pageNum is " + pageNum
getLinkedList(repoURL+auth)