(function() {
  var UserEvent, auth, db, eventsURL, getEvents, httpLink, nextPage, num, request, rootURL, saveEvent, traverseList, user, _;

  request = require('request');

  db = require('../../js/db.js');

  _ = require('underscore');

  httpLink = require('http-link');

  UserEvent = db.UserEvent;

  user = 'jkatsnelson';

  rootURL = 'https://api.github.com/users/';

  eventsURL = '/events/public';

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  num = 0;

  nextPage = null;

  getEvents = function(url) {
    if (url) {
      return request.get(url, function(err, res, body) {
        var eventList, links;

        if (err) {
          throw err;
        }
        links = httpLink.parse(res.headers.link);
        eventList = JSON.parse(body);
        nextPage = null;
        _.each(links, function(link) {
          if (link.rel === 'next') {
            return nextPage = link.href;
          } else {

          }
        });
        if (nextPage) {
          return traverseList(eventList, nextPage);
        } else {
          return traverseList(eventList);
        }
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
    var userEvent;

    num++;
    userEvent = new UserEvent({
      user: user,
      event: listItem
    });
    return userEvent.save(function(err) {
      if (err) {
        throw err;
      }
      console.log("went into save loop " + num);
      return traverseList(list);
    });
  };

  getEvents(rootURL + user + eventsURL + auth);

}).call(this);
