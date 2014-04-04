jade = require "jade"
path = require "path"
fs = require "fs"
postWirer = (code) ->
	code.replace("id=", "name=")
preWirer = (code) ->
	code.replace(/@([\w\d_\-]+)(.*?)\(/g, "$2(target=\"$1\"")
genJadeFile = (filename, upload = false) ->
	jadeCode = fs.readFileSync filename, "utf8"
	htmlCode = jade.render preWirer(jadeCode), { filename, pretty:true }
	wireFilename = filename[...-4] + "wire"
	fs.writeFile wireFilename, postWirer(htmlCode), (err) ->
		console.log "δ #{wireFilename}"
		throw err if err
genAll = ->
	for filename in fs.readdirSync "./"
		if filename[-4...] is "jade"
			genJadeFile(filename)
task "build", "compile jade files", genAll
task "watch", "watch to compile jade files", ->
	genAll()
	srcFW = fs.watch "./", {interval:500}
	srcFW.on "change", (event, filename) ->
		return if event isnt "change"
		return if not filename?
		return if filename[-4...] isnt "jade"
		console.log {event, filename}
		genJadeFile(filename)