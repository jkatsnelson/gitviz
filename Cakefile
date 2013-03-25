require 'flour'

task 'build:coffee', ->
  compile 'coffee/*', 'js/*'

task 'build:github', ->
  compile 'github/*.coffee', 'github/'
task 'build', ->
  invoke 'build:coffee'

task 'watch', ->
  invoke 'build:coffee'
  watch 'github/*', -> invoke 'build:github'
  watch 'coffee/*', -> invoke 'build:coffee'

task 'lint', 'Check javascript syntax', ->
  lint 'js/'