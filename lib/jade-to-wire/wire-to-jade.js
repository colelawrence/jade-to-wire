var fs = require("fs")
var jadeToWire = require("./main")

var genJadeFile = function(filename) {
    var wireCode = fs.readFileSync(filename, "utf8")
    jadeToWire.toJade(wireCode, function (jade) {
        var wireFilename = filename.slice(0, -4) + "jade"
        fs.writeFile(wireFilename, jade, {flag:"wx"}, function(err) {
            jadeToWire.timeLog("Converted " + wireFilename)
            if (err) {
                throw err
              }
          })
      })
  }

var checkToCompile = function(filename) {
    if (filename != null && filename.slice(-4) === "wire") genJadeFile(filename)
  }

var genAll = function() {
    jadeToWire.timeLog("Converting wire files")
    fs.readdirSync("./").forEach(checkToCompile)
  }

exports.run = genAll