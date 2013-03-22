mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/fantasygithub'
db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

leagueSchema = new Schema
  name: String
  teams: Array

teamSchema = new Schema
	name:
		type: String
		index:
			unique: true
	players: Array

playerSchema = new Schema
	name: String
	data: Object

League = mongoose.model('League', leagueSchema)

Player = mongoose.model('Player', playerSchema)

exports.Player = Player