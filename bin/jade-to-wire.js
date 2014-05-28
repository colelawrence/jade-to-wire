#!/usr/bin/env node

var fs = require("fs")
var jadeToWire = require("../lib/main")

// When watching scripts, it's useful to log changes with the timestamp.
var timeLog = function (message) {
    console.log((new Date).toLocaleTimeString() + " - " + message)
  }

var genWireFile = function(filename) {
    var jadeCode = fs.readFileSync(filename, "utf8")
    var jadeOptions = { filename: filename }
    jadeToWire.toWire(jadeCode, jadeOptions, function (wire) {
        var wireFilename = filename.slice(0, -4) + "wire"
        fs.writeFile(wireFilename, wire, function(err) {
            timeLog("Compiled " + wireFilename)
            if (err) {
              throw err
            }
          })
      })
  }

var checkToCompile = function(filename) {
    if (filename != null && filename.slice(-4) === "jade") genWireFile(filename)
  }

var genAll = function() {
    timeLog("Compiling jade files")
    fs.readdirSync("./").forEach(checkToCompile)
  }
genAll()
var srcFW = fs.watch("./", {
    interval: 500
  })
srcFW.on("change", function(event, filename) {
    if (event === "change") checkToCompile(filename)
  })
timeLog("Watching jade files")
