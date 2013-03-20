mongoose = require 'mongoose'

mongoose.connect('mongodb://localhost/fantasygithub')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

LeagueSchema = new Schema
  Teams: Array
  Name: String
  data: Object

LeagueSchema.methods.query = () ->
  console.log "Queried"
LeagueSchema.methods.get = () ->
  console.log "got"

exports.League = mongoose.model 'leagues', LeagueSchema