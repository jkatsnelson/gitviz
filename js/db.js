(function() {
  var League, ObjectId, Schema, db, leagueSchema, mongoose, playerSchema, teamSchema;

  mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/fantasygithub');

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  Schema = mongoose.Schema;

  ObjectId = Schema.ObjectId;

  leagueSchema = new Schema({
    name: String,
    teams: Array
  });

  teamSchema = new Schema({
    name: {
      type: String,
      index: {
        unique: true
      }
    },
    players: Array
  });

  playerSchema = new Schema({
    name: String
  });

  League = mongoose.model('League', leagueSchema);

  db.once('open', function() {
    var ncl;

    ncl = new League({
      name: 'National Codeslingers League'
    });
    console.log(ncl.name);
    return ncl.save(function(err) {
      if (err) {
        throw err;
      }
      console.log("saved!");
      return League.find({}, function(err, leagues) {
        console.log(leagues);
        return db.close();
      });
    });
  });

  exports.db = db;

}).call(this);
