require 'flour'

task 'build:coffee', ->
  compile 'server/coffee/*', 'server/js/*'

task 'build:github', ->
  compile 'github/coffee/*', 'github/js/*'

task 'build', ->
  invoke 'build:coffee'
  invoke 'build:github'

task 'watch', ->
  invoke 'build:coffee'
  watch 'github/*', -> invoke 'build:github'
  watch 'server/coffee/*', -> invoke 'build:coffee'

task 'lint', 'Check javascript syntax', ->
  lint 'js/'