mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/fantasygithub'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

LeagueSchema = new Schema
  name: String
  teams: Array

LeagueSchema.methods.get = () ->
  console.log "Got"

exports.LeagueSchema = mongoose.model 'leagues', LeagueSchema