var fs = require("fs")
var jadeToWire = require("./main")

var isJson = null
var varsExt
var genWireFile = function(filename) {
    var jadeCode = fs.readFileSync(filename, "utf8")
    var optionsFile
    var jadeOptions = {}
    try {
        optionsFile = fs.readFileSync("vars.cson", "utf8")
        // if no error, cson file read
        isJson = false
      } catch (err) {
          try {
              optionsFile = fs.readFileSync("vars.json", "utf8")
              isJson = true
            } catch (err) {
                jadeToWire.timeLog("Warning: no 'vars.json' or 'vars.cson' files found for jade to use.")
              }
        }
    if (optionsFile) {
        varsExt = (isJson?".json":".cson")
        var cson = require("./cson")
        try {
            jadeOptions = cson.parse(optionsFile, isJson)
          } catch (err) {
              jadeToWire.timeLog("Error! 'vars" + varsExt + "' is incorrectly formatted!")
              console.error(err.message)
            }
      }
    jadeOptions.filename = filename
    jadeToWire.toWire(jadeCode, jadeOptions, function (wire) {
        var wireFilename = filename.slice(0, -4) + "wire"
        fs.writeFile(wireFilename, wire, function(err) {
            jadeToWire.timeLog("Compiled " + wireFilename)
            if (err) {
              throw err
            }
          })
      })
  }

var checkToCompile = function(filename, checkVars) {
    if (filename != null){
      ext = filename.slice(-5)
        if (ext === ".jade")
            genWireFile(filename)
          else if (checkVars === true && isJson != null) {
              if (ext === varsExt) {
                  jadeToWire.timeLog("'vars" + varsExt + "' changed")
                  genAll()
                }
            }
      }
  }

var genAll = function() {
    fs.readdirSync("./").forEach(checkToCompile)
  }

exports.run = function () {
    jadeToWire.timeLog("Compiling jade files")
    genAll()    

    var srcFW = fs.watch("./", {
        interval: 500
      })
    srcFW.on("change", function(event, filename) {
        if (event === "change") checkToCompile(filename, true)
      })
    jadeToWire.timeLog("Watching jade files")
  }