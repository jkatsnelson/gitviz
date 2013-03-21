(function() {
  var LeagueSchema, ObjectId, Schema, db, mongoose;

  mongoose = require('mongoose');

  db = mongoose.connect('mongodb://localhost/fantasygithub');

  Schema = mongoose.Schema;

  ObjectId = Schema.ObjectId;

  LeagueSchema = new Schema({
    name: String,
    teams: Array
  });

  LeagueSchema.methods.get = function(wat) {
    return console.log(wat);
  };

  exports.League = mongoose.model('leagues', LeagueSchema);

}).call(this);
