db = require './db'
_ = require 'underscore'

League = db.League
Team = db.Team
Player = db.PLayer

# db.once 'open', ->
# Clear DB and add test data
League.remove({}, (err)-> console.log 'leagues cleared')
Team.remove({}, (err)-> console.log 'teams cleared')
jq = new Team {name: 'Team jQuery'}
under = new Team {name: 'The Underscorchers'}
jasmine = new Team {name: 'The Jasminers'}
teams = [jq, under, jasmine]
ncl = new League {name: 'National Codeslingers League', teams: teams}

items = [ncl, jq, under, jasmine]
_(items).each (x)-> x.save (err) ->
	throw err if err
	# League.find({}, (err, leagues) -> console.log leagues)
	# Team.find({}, (err, teams) -> console.log teams)

setTimeout ()->
	League.find({}, (err, leagues) -> console.log leagues)
	Team.find({}, (err, teams) -> console.log teams)
, 50