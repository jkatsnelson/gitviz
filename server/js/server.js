(function() {
  var app, db, express, getCommits, http, path, routes, userEvents;

  express = require('express');

  routes = require('routes');

  http = require('http');

  path = require('path');

  userEvents = require(__dirname + '/../../github/js/userEvents.js');

  getCommits = require(__dirname + '/../../github/js/repoCommits.js');

  db = require(__dirname + '/../../server/js/db.js');

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
      return res.send(events);
    });
    return userEvents.get(req.params.user);
  });

  app.get('/query/:user/repo/:repo', function(req, res) {
    var repoRoute;

    repoRoute = req.params.user + '/' + req.params.repo;
    return db.Commit.findOne({
      'repo': repoRoute
    }, 'commits', function(err, commitList) {
      var commitStream;

      if (err) {
        throw err;
      }
      if (commitList) {
        return res.send(commitList.commits);
      } else {
        res.write('[');
        commitStream = getCommits.init();
        commitStream.on('commit', function(commit) {
          return res.write(commit);
        });
        commitStream.on('end', function(string) {
          return res.end(']');
        });
        return commitStream.get(req.params.user, req.params.repo);
      }
    });
  });

  app.listen(3000);

  module.exports = app;

}).call(this);
