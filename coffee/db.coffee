mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/fantasygithub'
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
	name: String

League = mongoose.model('League', leagueSchema)

# LeagueSchema.methods.get = (wat) ->
#   console.log wat

db.once 'open', ->
	# Clear DB and add test data
	League.remove({}, (err)-> console.log 'leagues cleared')
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