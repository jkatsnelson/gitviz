GitViz
=

GitViz is an experiment with the Github API and data visualization
  - Type in a user and find details about their github activities
  - Type in a repository name and find out where in the world every commit came from


Version
-

0.1

Tech
-

* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]

See It in Production: [gitviz.jit.su]
-

Hosted by nodejitsu.com

Interesting technical challenges:
-

Requesting commit history from the Github API returns the name of each author, but none of the details about their locations. So, Gitviz makes a second request to the Github API for an author's location. Afterwards, a third request goes to the google maps API to get the latitude and longitude for each location.

On large repositories with many authors, this could potentially happen thousands of times. A new get request to the Github API is made for every 30 commits.

As a result, some interesting problems came up in creating a node service that gathers this data:

* How do I not go into callback hell while doing multiple API calls?
* How do I send a giant amount of commit history to the client as I make multiple API calls for location data, commit by commit?

Solutions:

Using Node's EventEmitter library
-
GitViz uses the EventEmitter library for two main purposes:

* Preventing callback messes.
* It makes streaming data incrementally to the client clean and simple



Here is how I did it:

Require the library:

    EventEmitter = require('events').EventEmitter

Create a unique instance of event emitter. I built an 'initialize' function that wraps the creation process. I export this to my express server file.

    init = () ->
    #this 'reset' method re-initializes global constants used in the script.
      reset()
      eventMaker = new EventEmitter
      eventMaker.get = get
      return eventMaker

When I run init() in the express server, it gives me both the "get" function, which makes the necessary API calls, and the ability to emit events, and set triggers.

Here is the relevant server code:

    app.get '/query/:user/repo/:repo', (req, res) ->
      repoRoute = req.params.user + '/' + req.params.repo
      db.Commit.findOne { 'repo': repoRoute }, 'commits', (err, commitList) ->
        throw err if err
        if commitList
          res.send commitList.commits
        else
          res.write '['
    #getCommits.init() is the same as init() above.
          commitStream = getCommits.init()
          commitStream.on 'commit', (commit) ->
            res.write commit
          commitStream.on 'end', (string) ->
            res.end ']'
          commitStream.get req.params.user, req.params.repo

After the event emitter has been initialized, I now have access to setting triggers with "commitStream.on"

These line up with when I emit a 'commit' event from inside the worker, after I have the latitude and longitudes for any given commit:

    currentRequest.emit 'commit', commitLocation
    
This event emitter was easy to implement, but I got snagged temporarily by not having an initialize function wrapping around it.

Before I wrapped the instantiation of the event emitter ('new EventEmitter') in an initialize function, I was adding events and triggers to the same event emitter on every 'get' request from the client to the server. This resulted in pre-mature triggering of the events after the first time the eventEmitter is set.

Be careful of premature event emission!

Using res.write and res.end
-

Grabbing all the commits on a large repository can take more than 2 minutes. When deciding between sockets or get requests, it felt intuitive to just use a socket and emit an event to the client when all the commits were ready, and then just send them all at once.

Instead of implementing sockets, I just stuck with node's native 'write' and 'end' function, combined with the event emitter.

Every time this line ran on the node worker:
    currentRequest.emit 'commit', commitLocation

It triggered this event on the server:

    #this line opens an array to place commits into
    res.write '['
    #this event places events into the array
    commitStream.on 'commit', (commit) ->
        res.write commit

By using res.write instead of res.send or res.end, I allow the connection to receive a small amount of the data. This prevents the browser from shutting down a hanging get request.

When the last commit is ready, the worker emits this event:
    currentRequest.emit 'end', 'done!'
    
Resulting in ending the response and closing the array on the client:

    commitStream.on 'end', (string) ->
        res.end ']'

res.end tells the client to close the response.

[node.js]: http://nodejs.org
[Twitter Bootstrap]: http://twitter.github.com/bootstrap/
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[gitviz.jit.su]: https://gitviz.jit.su/