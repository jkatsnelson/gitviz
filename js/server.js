(function() {
  var angularBridge, app, db, everyauth, express, http, path, routes;

  express = require('express');

  routes = require('routes');

  http = require('http');

  path = require('path');

  everyauth = require('everyauth');

  db = require('./db.js');

  app = express();

  angularBridge = new (require('angular-bridge'))(app, {
    urlPrefix: '/api/'
  });

  angularBridge.addResource('leagues', db.League);

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    return app.use(app.router);
  });

  app.use("/", express["static"](__dirname + '/../client/app/'));

  http.createServer(app).listen(app.get('port'), function() {
    return console.log("Express server listening on port " + (app.get('port')));
  });

}).call(this);
