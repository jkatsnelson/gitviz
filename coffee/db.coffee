mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/fantasygithub'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

LeagueSchema = new Schema
  name: String
  teams: Array

LeagueSchema.methods.get = (wat) ->
  console.log wat

exports.League = mongoose.model 'leagues', LeagueSchema