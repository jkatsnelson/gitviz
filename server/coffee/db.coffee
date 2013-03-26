mongoose = require 'mongoose'
mongoose.connect 'mongodb://octocat:1@ds043027.mongolab.com:43027/fantasygithub'

db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
Schema = mongoose.Schema

commitSchema = new Schema
	repo: String
	location: Object
	contributor: Object
	message: String
	date: Date

Commit = mongoose.model 'Commit', commitSchema

userEventSchema = new Schema
  user: String
  event: Object

UserEvent = mongoose.model 'UserEvent', userEventSchema

repoEventSchema = new Schema
  repo: String
  event: Object

RepoEvent = mongoose.model 'RepoEvent', repoEventSchema

exports.UserEvent = UserEvent
exports.RepoEvent = RepoEvent
exports.Commit = Commit
exports.db = db