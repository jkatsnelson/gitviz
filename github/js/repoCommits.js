(function() {
  var Commit, EventEmitter, auth, db, fetchLocation, findCommits, fs, gm, httpLink, locations, nextPage, repoURL, request, saveCommit, traverseList, userURL, _;

  request = require('request');

  db = require(__dirname + '/../../server/js/db.js');

  gm = require("googlemaps");

  fs = require("fs");

  httpLink = require('http-link');

  _ = require('underscore');

  EventEmitter = require('events').EventEmitter;

  Commit = db.Commit;

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  repoURL = 'https://api.github.com/repos/';

  userURL = 'https://api.github.com/users/';

  locations = {};

  nextPage = null;

  findCommits = new EventEmitter;

  findCommits.get = function(author, repo) {
    var url;

    if (author) {
      url = repoURL + author + '/' + repo + '/commits';
    }
    if (nextPage) {
      url = nextPage;
    }
    return request.get(url, function(err, res, body) {
      var commitList, links;

      if (err) {
        throw err;
      }
      nextPage = null;
      commitList = JSON.parse(body);
      if (!res.headers.link) {
        return traverseList(commitList);
      }
      links = httpLink.parse(res.headers.link);
      _.each(links, function(link) {
        if (link.rel === 'next') {
          return nextPage = link.href;
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
        return saveCommit(commitList.shift(), commitList);
      } else {
        return fetchLocation(contributor, commitList);
      }
    } else {
      if (nextPage) {
        return findCommits.get();
      } else {
        findCommits.emit('commits', 'done');
        return db.db.close();
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
        console.log(locations[contributor]);
        return traverseList(commitList);
      });
    });
  };

  saveCommit = function(commit, commitList) {
    var newCommit;

    newCommit = new Commit({
      repo: author + '/' + repoName,
      contributor: commit.author.login,
      message: commit.commit.message,
      date: commit.commit.author.date,
      location: locations[commit.author.login]
    });
    return newCommit.save(function(err) {
      if (err) {
        throw err;
      }
      return traverseList(commitList);
    });
  };

  findCommits.get(repoURL + auth);

}).call(this);
