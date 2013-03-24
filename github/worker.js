(function() {
  var Repo, auth, author, db, getLinkedList, pageNum, repoName, repoURL, request;

  request = require('request');

  db = require('../js/db.js');

  Repo = db.Repo;

  repoName = 'coffee-script';

  author = 'jashkenas';

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  repoURL = 'https://api.github.com/repos/' + author + '/' + repoName + '/commits';

  pageNum = 0;

  getLinkedList = function(url) {
    var repo;

    pageNum++;
    repo = new Repo({
      repo: repoName,
      author: author,
      page: pageNum
    });
    return request.get(url, function(err, res, body) {
      if (err) {
        throw err;
      }
      repo.commits = body;
      return repo.save(function(err, repo) {
        var nextLink;

        if (err) {
          throw err;
        }
        if (res.headers.link) {
          if (res.headers.link.split(";").length > 2) {
            console.log(pageNum);
            nextLink = res.headers.link.split("<")[1].split(">")[0];
            return getLinkedList(nextLink);
          } else {
            throw "List ended. Done saving. Last doc pageNum is " + pageNum;
          }
        } else {
          throw "Done saving, last doc pageNum is " + pageNum;
        }
      });
    });
  };

  getLinkedList(repoURL + auth);

}).call(this);
