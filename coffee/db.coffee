mongoose = require 'mongoose'
db = mongoose.connect 'mongodb://localhost/fantasygithub'
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

LeagueSchema = new Schema
  name: String
  teams: Array

exports.League = mongoose.model 'leagues', LeagueSchema