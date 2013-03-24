(function() {
  var Commit, Schema, commitSchema, db, mongoose;

  mongoose = require('mongoose');

  mongoose.connect('mongodb://octocat:1@ds043027.mongolab.com:43027/fantasygithub');

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  Schema = mongoose.Schema;

  commitSchema = new Schema({
    repo: String,
    location: String,
    contributor: Object,
    message: String,
    Date: Date
  });

  Commit = mongoose.model('Commit', commitSchema);

  exports.Commit = Commit;

  exports.db = db;

}).call(this);
