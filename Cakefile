require 'flour'

task 'build:coffee', ->
    compile 'coffee/*', 'js/*'
    compile 'github/worker.coffee', 'github/worker.js'

task 'build', ->
    invoke 'build:coffee'

task 'watch', ->
    invoke 'build:coffee'
    watch 'coffee/*', -> invoke 'build:coffee'

task 'lint', 'Check javascript syntax', ->
    lint 'js/'