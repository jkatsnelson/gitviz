(function() {
  var Commit, RepoEvent, Schema, UserEvent, commitSchema, db, mongoose, repoEventSchema, userEventSchema;

  mongoose = require('mongoose');

  mongoose.connect('mongodb://octocat:1@ds043027.mongolab.com:43027/fantasygithub');

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  Schema = mongoose.Schema;

  commitSchema = new Schema({
    repo: String,
    commits: Object
  });

  Commit = mongoose.model('Commit', commitSchema);

  userEventSchema = new Schema({
    user: String,
    events: Object
  });

  UserEvent = mongoose.model('UserEvent', userEventSchema);

  repoEventSchema = new Schema({
    repo: String,
    event: Object
  });

  RepoEvent = mongoose.model('RepoEvent', repoEventSchema);

  exports.UserEvent = UserEvent;

  exports.RepoEvent = RepoEvent;

  exports.Commit = Commit;

  exports.db = db;

}).call(this);
