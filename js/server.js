(function() {
  var app, everyauth, express, http, path, routes;

  express = require('express');

  routes = require('routes');

  http = require('http');

  path = require('path');

  everyauth = require('everyauth');

  app = express();

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    return app.use(app.router);
  });

  app.use("/", express["static"](__dirname + '/../client/app/'));

  http.createServer(app).listen(app.get('port'), function() {
    return console.log("Express server listening on port " + (app.get('port')));
  });

}).call(this);
