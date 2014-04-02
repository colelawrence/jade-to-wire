fs = require "fs"
ftpconf = { username: "", host: "studio.rarewire.com" }
configFile = ".ftpsrc"
try ftpconf = JSON.parse fs.readFileSync configFile, "utf8"
catch
	fs.writeFileSync configFile, JSON.stringify(ftpconf, null, 2)

args = process.argv.slice()
file = false
while arg = args.shift()
	switch arg
		when "--file"
			file = args.shift()
		when "--password"
			ftpconf.password = args.shift()

console.log("End while")
ftpconf.protocol = 'ftps'
ftps = new (require 'ftps')(ftpconf)
ftps.put(file).exec((o1,o2,o3) -> console.log(o1,o2,o3))