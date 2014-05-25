#!/usr/bin/env node

var fs, genAll, genJadeFile, checkToCompile, timeLog, keywords, jade, path;
jade = require("jade");
path = require("path");
fs = require("fs");
jadeToWire = require("../lib/main")
// When watching scripts, it's useful to log changes with the timestamp.
timeLog = function (message) {
  console.log((new Date).toLocaleTimeString() + " - " + message);
}

genJadeFile = function(filename) {
  var jadeCode = fs.readFileSync(filename, "utf8");
  var code = jadeToWire.render(jadeCode, null, filename)
  var wireFilename = filename.slice(0, -4) + "wire";
  fs.writeFile(wireFilename, code, function(err) {
    timeLog("Compiled " + wireFilename);
    if (err) {
      throw err;
    }
  });
};

checkToCompile = function(filename) {
  if (filename != null && filename.slice(-4) === "jade") genJadeFile(filename);
}
genAll = function() {
  timeLog("Compiling jade files");
  fs.readdirSync("./").forEach(checkToCompile);
};

var srcFW;
genAll();
srcFW = fs.watch("./", {
  interval: 500
});
srcFW.on("change", function(event, filename) {
  if (event === "change") checkToCompile(filename);
});
timeLog("Watching jade files");
