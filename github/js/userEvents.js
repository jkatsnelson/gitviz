(function() {
  var EventEmitter, UserEvent, auth, db, events, eventsURL, find, httpLink, nextPage, num, request, rootURL, saveEvents, user, util, _;

  request = require('request');

  db = require(__dirname + '/../../server/js/db.js');

  _ = require('underscore');

  httpLink = require('http-link');

  EventEmitter = require('events').EventEmitter;

  util = require('util');

  UserEvent = db.UserEvent;

  user = 'jkatsnelson';

  rootURL = 'https://api.github.com/users/';

  eventsURL = '/events/public';

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  nextPage = null;

  events = [];

  num = 0;

  find = new EventEmitter;

  find.getEvents = function(user) {
    var url;

    url = rootURL + user + eventsURL + auth;
    if (nextPage) {
      url = nextPage;
    }
    return request.get(url, function(err, res, body) {
      var links;

      if (err) {
        throw err;
      }
      if (res.headers.link) {
        links = httpLink.parse(res.headers.link);
        events = events.concat(JSON.parse(body));
        nextPage = null;
        _.each(links, function(link) {
          if (link.rel === 'next') {
            return nextPage = link.href;
          } else {

          }
        });
        if (nextPage) {
          return find.getEvents(user);
        } else {
          find.emit('events', events);
          return saveEvents(events);
        }
      } else {
        return find.emit('events', events);
      }
    });
  };

  saveEvents = function(events) {
    var userEvent;

    userEvent = new UserEvent({
      user: user,
      events: events
    });
    return userEvent.save(function(err) {
      if (err) {
        throw err;
      }
      return db.db.close();
    });
  };

  exports.find = find;

}).call(this);
