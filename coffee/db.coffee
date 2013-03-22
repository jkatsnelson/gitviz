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

League = mongoose.model('League', leagueSchema)

# LeagueSchema.methods.get = (wat) ->
#   console.log wat

db.once 'open', ->
	ncl = new League {name: 'National Codeslingers League'}
	console.log ncl.name
	ncl.save (err) ->
		throw err if err
		console.log "saved!"
		League.find({}, (err,leagues) ->
			console.log leagues
			db.close()
		)

exports.db = db