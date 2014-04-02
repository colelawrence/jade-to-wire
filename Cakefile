jade = require 'jade'
path = require 'path'
fs = require 'fs'
prompt = require 'prompt'
config = { skipFTPS: false, lftpPath: "./lftp/bin/" }

schema = {
	properties: {
		password: {
			hidden: true,
			required: true
		}
	}
}

configFile = ".jadetowirerc"
try config = JSON.parse fs.readFileSync configFile, "utf8"
catch
	fs.writeFileSync configFile, JSON.stringify(config, null, 2)

callUpload = (file) ->
	spawn = require('child_process').spawn 'cmd', ['/c', "set", "PATH=\"%PATH%;#{path.resolve(config.lftpPath)}\"", "&&", "path",
		"&&", "coffee", "--password", config.password, "--file", file]
	spawn.on 'error', std
	spawn.stdout.on 'data', std
	spawn.stderr.on 'data', std

std = (data)-> console.log data.toString()
postWirer = (code) ->
	code.replace('id=', 'name=')
genJadeFile = (filename, upload = false) ->
	jadeCode = fs.readFileSync filename, "utf8"
	htmlCode = jade.render jadeCode, { filename, pretty:true }
	wireFilename = filename[...-4] + "wire"
	fs.writeFile wireFilename, postWirer(htmlCode), (err) ->
		if err
				console.log "Error writing " + wireFilename
				console.log err
		if upload
			callUpload(wireFilename)
genAll = (upload) ->
	for filename in fs.readdirSync './'
		if filename[-4...] is "jade"
			genJadeFile(filename, upload)
task 'build', 'compile jade files and upload to server', ->
	if not config.skipFTPS
		prompt.start()
		prompt.get schema, (err, results) ->
			config.password = results.password
			genAll(true)
	else genAll()
task 'watch', 'watch to compile jade files and upload to server', ->
	genAll()
	srcFW = fs.watch "./", {interval:500}
	srcFW.on 'change', (event, filename) ->
		return if filename[-4...] isnt 'jade'
		console.log 'Change detected on jade file: #{filename}\nCompiling...'
		genJadeFile(filename, !!config.protocol)