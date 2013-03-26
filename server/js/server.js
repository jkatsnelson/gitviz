(function() {
  var app, express, github, http, path, routes;

  express = require('express');

  routes = require('routes');

  http = require('http');

  path = require('path');

  github = require(__dirname + '/../../github/js/userEvents.js');

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
    app.use(express["static"](path.join(app.pwd, '/app/')));
    return app.use(express.logger());
  });

  console.log('Go to http://localhost:3000');

  app.get('/wat', function(req, res) {
    console.log('wat');
    return res.send('wat');
  });

  app.get('/query/:user', function(req, res) {
    debugger;    github.getEvents().on('events', function(events) {
      return res.send(events);
    });
    return github.getEvents(req.params.user);
  });

  app.listen(3000);

  module.exports = app;

}).call(this);
