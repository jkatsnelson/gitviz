db = require './db'
_ = require 'underscore'

League = db.League
Team = db.Team
Player = db.Player

# db.once 'open', ->
# Clear DB and add test data
League.remove({}, (err)-> console.log 'leagues cleared')
Team.remove({}, (err)-> console.log 'teams cleared')
Player.remove({}, (err)-> console.log 'players cleared')

setTimeout ()->
	jresig = new Player {name: 'John Resig'}
	players = [jresig]
	jq = new Team {name: 'Team jQuery', players: players}
	under = new Team {name: 'The Underscorchers'}
	jasmine = new Team {name: 'The Jasminers'}
	teams = [jq, under, jasmine]
	ncl = new League {name: 'National Codeslingers League', teams: teams}
	items = [ncl, jq, under, jasmine]
	_(items).each (x)-> x.save (err) ->
		throw err if err
		# League.find({}, (err, leagues) -> console.log leagues)
		# Team.find({}, (err, teams) -> console.log teams)
, 250

setTimeout ()->
	League.find({}, (err, leagues) -> console.log leagues)
	Team.find({}, (err, teams) -> console.log teams)
	Player.find({}, (err, players) -> console.log players)
, 300