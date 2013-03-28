(function() {
  var app, commits, express, http, path, routes, userEvents;

  express = require('express');

  routes = require('routes');

  http = require('http');

  path = require('path');

  userEvents = require(__dirname + '/../../github/js/userEvents.js');

  commits = require(__dirname + '/../../github/js/repoCommits.js');

  app = express();

  app.configure(function() {
    app.pwd = path.dirname(module.uri);
    app.set('port', process.env.PORT || 3000);
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.cookieParser('secretz'));
    app.use(express.session());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express["static"](path.join(app.pwd, '/client/app/')));
    return app.use(express.logger());
  });

  console.log('Go to http://localhost:3000');

  app.get('/query/:user', function(req, res) {
    userEvents = userEvents.init();
    userEvents.on('events', function(events) {
      console.log(events);
      return res.send(events);
    });
    return userEvents.get(req.params.user);
  });

  app.get('/query/:user/repo/:repo', function(req, res) {
    commits.find.on('commits', function(commits) {
      return res.send(commits);
    });
    return commits.find.get(req.params.user, req.params.repo);
  });

  app.listen(3000);

  module.exports = app;

}).call(this);
