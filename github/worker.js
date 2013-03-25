(function() {
  var Commit, auth, author, db, fetchLocation, fs, getCommits, gm, locations, repoName, repoURL, request, saveCommit, traverseList, userURL, util;

  request = require('request');

  db = require('../js/db.js');

  gm = require("googlemaps");

  util = require("util");

  fs = require("fs");

  Commit = db.Commit;

  repoName = 'coffee-script';

  author = 'jashkenas';

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  repoURL = 'https://api.github.com/repos/' + author + '/' + repoName + '/commits';

  userURL = 'https://api.github.com/users/';

  locations = {};

  getCommits = function(url) {
    return request.get(url, function(err, res, body) {
      var commitList;

      if (err) {
        throw err;
      }
      commitList = JSON.parse(body);
      if (!res.headers.link) {
        console.log("Commit list is only one page long.");
        return traverseList(commitList);
      }
      if (res.headers.link.split(";").length > 2) {
        return traverseList(commitList, res.headers.link.split("<")[1].split(">")[0]);
      } else {
        return traverseList(commitList && console.log("List ended."));
      }
    });
  };

  traverseList = function(commitList, nextPage) {
    var contributor;

    if (!nextPage) {
      nextPage = null;
    }
    if (!commitList) {
      commitList = [];
    }
    if (commitList.length) {
      if (!commitList[0].author) {
        commitList[0].author = {
          login: 'not specified'
        };
      }
      contributor = commitList[0].author.login;
      if (locations[contributor]) {
        return saveCommit(commitList.shift(), commitList, nextPage);
      } else {
        return fetchLocation(contributor, commitList, nextPage);
      }
    } else {
      if (nextPage) {
        return getCommits(nextPage);
      } else {
        return console.log('done saving.');
      }
    }
  };

  fetchLocation = function(contributor, commitList, nextPage) {
    return request.get(userURL + contributor + auth, function(err, res, body) {
      var user;

      if (err) {
        throw err;
      }
      user = JSON.parse(body);
      if (!user.location) {
        user.location = "Not specified";
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
        return traverseList(commitList, nextPage);
      });
    });
  };

  saveCommit = function(commit, commitList, nextPage) {
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
      return traverseList(commitList, nextPage);
    });
  };

  getCommits(repoURL + auth);

}).call(this);
