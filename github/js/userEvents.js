(function() {
  var EventEmitter, UserEvent, auth, db, events, eventsURL, get, httpLink, init, nextPage, request, rootURL, saveEvents, _;

  request = require('request');

  db = require(__dirname + '/../../server/js/db.js');

  _ = require('underscore');

  httpLink = require('http-link');

  EventEmitter = require('events').EventEmitter;

  UserEvent = db.UserEvent;

  rootURL = 'https://api.github.com/users/';

  eventsURL = '/events/public';

  auth = '?client_id=2bf1c804756e95d43bec&client_secret=16516757e1d87c3f13802448685375ee04674105';

  nextPage = null;

  events = [];

  init = function() {
    var eventMaker;

    events = [];
    eventMaker = new EventEmitter;
    eventMaker.init = init;
    eventMaker.get = get;
    return eventMaker;
  };

  get = function(user) {
    var that, url;

    that = this;
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
          return that.get(user);
        } else {
          that.emit('events', events);
          return saveEvents(events);
        }
      } else {
        return that.emit('events', events);
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

  exports.init = init;

}).call(this);
