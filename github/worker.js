(function() {
  var Commit, auth, author, db, getCommits, repoName, repoURL, request, saveToDB;

  request = require('request');

  db = require('../js/db.js');

  Commit = db.Commit;

  repoName = 'deface-meteor';

  author = 'jkatsnelson';

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  repoURL = 'https://api.github.com/repos/' + author + '/' + repoName + '/commitList';

  getCommits = function(url) {
    return request.get(url, function(err, res, body) {
      var commitList;

      if (err) {
        throw err;
      }
      commitList = JSON.parse(body);
      console.log(res);
      if (!res.headers.link) {
        console.log("Commit list is only one page long.");
        return saveToDB(commitList);
      }
      if (res.headers.link.split(";").length > 2) {
        return saveToDB(commitList, res.headers.link.split("<")[1].split(">")[0]);
      } else {
        saveToDB(commitList);
        return console.log("List ended.");
      }
    });
  };

  saveToDB = function(commitList, nextPage) {
    var commit, commitObject;

    if (commitList.length) {
      commitObject = commitList.pop();
      commit = new Commit({
        repo: author + '/' + repoName,
        contributor: commitObject.author,
        message: commitObject.commit.message,
        date: commitObject.author.date
      });
      return commit.save(function(err) {
        if (err) {
          throw err;
        }
        return saveToDB(commitList);
      });
    } else {
      if (nextPage) {
        return getCommits(nextPage);
      } else {
        return console.log('done saving.');
      }
    }
  };

  getCommits(repoURL + auth);

}).call(this);
