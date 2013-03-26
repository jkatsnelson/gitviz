db = require './db'
_ = require 'underscore'
async = require 'async'

League = db.League
Team = db.Team
Player = db.Player

# db.once 'open', ->
# Clear DB and add test data
async.parallel [
	(callback) ->
		League.remove {}, (err, result)->
			console.log 'leagues cleared'
			callback err
	(callback) ->
		Team.remove {}, (err, result)->
			console.log 'teams cleared'
			callback err
	(callback) ->
		Player.remove {}, (err, result)->
			console.log 'players cleared'
			callback err
], (callback)->
	console.log 'start 2nd block'
	jresig = new Player {name: 'John Resig'}
	players = [jresig]
	jq = new Team {name: 'Team jQuery', players: players}
	under = new Team {name: 'The Underscorchers'}
	jasmine = new Team {name: 'The Jasminers'}
	teams = [jq, under, jasmine]
	ncl = new League {name: 'National Codeslingers League', teams: teams}
	items = [ncl, jq, under, jasmine]
	async.eachSeries items, (x)->
		x.save (err) ->
			throw err if err
	, (callback)->
		League.find({}, (err, leagues) -> console.log leagues)
		Team.find({}, (err, teams) -> console.log teams)
		Player.find({}, (err, players) -> console.log players)
		callback err

