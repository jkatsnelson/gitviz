mongoose = require 'mongoose'
mongoose.connect 'mongodb://octocat:1@ds043027.mongolab.com:43027/fantasygithub'

db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

Schema = mongoose.Schema

leagueSchema = new Schema
	name:
		type: String
		required: true
		unique: true
	teams: Array

teamSchema = new Schema
	name:
		type: String
		required: true
		unique: true
	players: Array

playerSchema = new Schema
	name:
		type: String
		required: true
		unique: true
	data: Object

repoSchema = new Schema
	name: String
	commits: Array
	follows: Array
	stars: Array
	pulls: Array
	forks: Array

League = mongoose.model('League', leagueSchema)
Team = mongoose.model('Team', teamSchema)
Player = mongoose.model('Player', playerSchema)
Repo = mongoose.model('Repo', repoSchema)

exports.Repo = Repo
exports.League = League
exports.Team = Team
exports.Player = Player
exports.db = db