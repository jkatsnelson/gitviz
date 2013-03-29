(function() {
  var Commit, EventEmitter, auth, db, fantasyGithub, fetchLocation, fs, get, gm, httpLink, init, pushCommit, repoURL, request, reset, saveCommits, traverseList, userURL, _;

  request = require('request');

  db = require(__dirname + '/../../server/js/db.js');

  gm = require('googlemaps');

  fs = require('fs');

  httpLink = require('http-link');

  _ = require('underscore');

  EventEmitter = require('events').EventEmitter;

  Commit = db.Commit;

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  repoURL = 'https://api.github.com/repos/';

  userURL = 'https://api.github.com/users/';

  fantasyGithub = {};

  reset = function() {
    fantasyGithub.locations = {};
    fantasyGithub.commits = [];
    fantasyGithub.nextPage = null;
    fantasyGithub.repoName = null;
    fantasyGithub.repoAuthor = null;
    fantasyGithub.currentRequest = null;
    fantasyGithub.page = 0;
    return fantasyGithub.firstCommit = true;
  };

  init = function() {
    var eventMaker;

    reset();
    eventMaker = new EventEmitter;
    eventMaker.init = init;
    eventMaker.get = get;
    return eventMaker;
  };

  get = function(author, repo) {
    var url;

    fantasyGithub.currentRequest = this;
    if (author) {
      fantasyGithub.repoAuthor = author;
      fantasyGithub.repoName = repo;
      url = repoURL + author + '/' + repo + '/commits' + auth;
    }
    if (fantasyGithub.nextPage) {
      url = fantasyGithub.nextPage;
    }
    return request.get(url, function(err, res, body) {
      var commitList;

      if (err) {
        throw err;
      }
      fantasyGithub.nextPage = null;
      commitList = JSON.parse(body);
      if (!res.headers.link) {
        return traverseList(commitList);
      }
      _(httpLink.parse(res.headers.link)).each(function(link) {
        if (link.rel === 'next') {
          fantasyGithub.nextPage = link.href;
          return console.log(fantasyGithub.page++);
        } else {

        }
      });
      return traverseList(commitList);
    });
  };

  traverseList = function(commitList) {
    var contributor;

    if (commitList.length) {
      if (!commitList[0].author) {
        commitList[0].author = {
          login: 'not specified'
        };
      }
      contributor = commitList[0].author.login;
      if (fantasyGithub.locations.contributor) {
        return pushCommit(commitList.shift(), commitList);
      } else {
        return fetchLocation(contributor, commitList);
      }
    } else {
      if (fantasyGithub.nextPage) {
        return fantasyGithub.currentRequest.get();
      } else {
        return saveCommits(fantasyGithub.commits);
      }
    }
  };

  fetchLocation = function(contributor, commitList) {
    return request.get(userURL + contributor + auth, function(err, res, body) {
      var user;

      if (err) {
        throw err;
      }
      user = JSON.parse(body);
      if (!user.location) {
        user.location = "Antartica";
      }
      return gm.geocode(user.location, function(err, data) {
        if (err) {
          throw err;
        }
        if (data.status === "OK") {
          fantasyGithub.locations.contributor = {
            userInput: user.location,
            city: data.results[0].formatted_address,
            lat: data.results[0].geometry.location.lat,
            lon: data.results[0].geometry.location.lng
          };
        } else {
          locations[contributor] = {
            city: user.location
          };
        }
        return traverseList(commitList);
      });
    });
  };

  pushCommit = function(commit, commitList) {
    var newCommit;

    newCommit = {
      repo: fantasyGithub.repoAuthor + '/' + fantasyGithub.repoName,
      contributor: commit.author.login,
      message: commit.commit.message,
      date: commit.commit.author.date,
      location: fantasyGithub.locations[commit.author.login]
    };
    fantasyGithub.commits.push(newCommit);
    if (fantasyGithub.firstCommit) {
      commit = JSON.stringify(newCommit);
    } else {
      commit = ',' + JSON.stringify(newCommit);
    }
    fantasyGithub.currentRequest.emit('commit', commit.locatioon);
    fantasyGithub.firstCommit = false;
    return traverseList(commitList);
  };

  saveCommits = function(commits) {
    var newCommit;

    fantasyGithub.currentRequest.emit('end', 'done!');
    newCommit = new Commit({
      repo: fantasyGithub.repoAuthor + '/' + fantasyGithub.repoName,
      commits: commits
    });
    return newCommit.save(function(err) {
      if (err) {
        throw err;
      }
      console.log('saved ' + fantasyGithub.repoAuthor + '/' + fantasyGithub.repoName);
      return db.db.close();
    });
  };

  exports.init = init;

}).call(this);
