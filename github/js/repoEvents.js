(function() {
  var RepoEvent, auth, db, eventsURL, getEvents, httpLink, nextPage, num, owner, repo, request, rootURL, saveEvent, traverseList, _;

  request = require('request');

  db = require('../../js/db.js');

  _ = require('underscore');

  httpLink = require('http-link');

  RepoEvent = db.RepoEvent;

  owner = 'jkatsnelson/';

  repo = 'fantasygithub';

  rootURL = 'https://api.github.com/repos/';

  eventsURL = '/events';

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  num = 0;

  nextPage = null;

  getEvents = function(url) {
    if (url) {
      console.log(url);
      return request.get(url, function(err, res, body) {
        var eventList, links;

        if (err) {
          throw err;
        }
        console.log(res.headers);
        eventList = JSON.parse(body);
        if (!res.headers.link) {
          return traverseList(eventList);
        }
        links = httpLink.parse(res.headers.link);
        nextPage = null;
        _.each(links, function(link) {
          if (link.rel === 'next') {
            return nextPage = link.href;
          } else {

          }
        });
        return traverseList(eventList);
      });
    } else {
      throw console.error("done");
    }
  };

  traverseList = function(list) {
    if (list.length) {
      return saveEvent(list.shift(), list, nextPage);
    } else {
      return getEvents(nextPage);
    }
  };

  saveEvent = function(listItem, list) {
    var repoEvent;

    num++;
    repoEvent = new RepoEvent({
      repo: owner + repo,
      event: listItem
    });
    return repoEvent.save(function(err) {
      if (err) {
        throw err;
      }
      console.log("went into save loop " + num);
      return traverseList(list);
    });
  };

  getEvents(rootURL + owner + repo + eventsURL + auth);

}).call(this);
