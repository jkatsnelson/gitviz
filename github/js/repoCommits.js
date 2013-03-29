(function() {
  var Commit, EventEmitter, auth, commits, db, fetchLocation, firstCommit, fs, get, gm, httpLink, init, locations, nextPage, page, pushCommit, repoAuthor, repoName, repoURL, request, saveCommits, that, traverseList, userURL, _;

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

  locations = {};

  commits = [];

  nextPage = null;

  repoName = null;

  repoAuthor = null;

  that = null;

  page = 0;

  firstCommit = true;

  init = function() {
    var eventMaker;

    locations = {};
    commits = [];
    nextPage = null;
    that = null;
    page = 0;
    firstCommit = true;
    eventMaker = new EventEmitter;
    eventMaker.init = init;
    eventMaker.get = get;
    return eventMaker;
  };

  get = function(author, repo) {
    var url;

    that = this;
    if (author) {
      repoAuthor = author;
      repoName = repo;
      url = repoURL + repoAuthor + '/' + repoName + '/commits' + auth;
    }
    if (nextPage) {
      url = nextPage;
    }
    return request.get(url, function(err, res, body) {
      var commitList;

      if (err) {
        throw err;
      }
      nextPage = null;
      commitList = JSON.parse(body);
      if (!res.headers.link) {
        return traverseList(commitList);
      }
      _(httpLink.parse(res.headers.link)).each(function(link) {
        if (link.rel === 'next') {
          nextPage = link.href;
          return console.log(page++);
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
      if (locations[contributor]) {
        return pushCommit(commitList.shift(), commitList);
      } else {
        return fetchLocation(contributor, commitList);
      }
    } else {
      if (nextPage) {
        return that.get();
      } else {
        return saveCommits(commits);
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
          locations[contributor] = {
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
      repo: repoAuthor + '/' + repoName,
      contributor: commit.author.login,
      message: commit.commit.message,
      date: commit.commit.author.date,
      location: locations[commit.author.login]
    };
    commits.push(newCommit);
    if (firstCommit) {
      commit = JSON.stringify(newCommit);
    } else {
      commit = ',' + JSON.stringify(newCommit);
    }
    that.emit('commit', commit);
    firstCommit = false;
    return traverseList(commitList);
  };

  saveCommits = function(commits) {
    var newCommit;

    that.emit('end', 'done!');
    newCommit = new Commit({
      repo: repoAuthor + '/' + repoName,
      commits: commits
    });
    return newCommit.save(function(err) {
      if (err) {
        throw err;
      }
      console.log('saved ' + repoAuthor + '/' + repoName);
      return db.db.close();
    });
  };

  exports.init = init;

}).call(this);
