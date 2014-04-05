#!/usr/bin/env node

var fs, genAll, genJadeFile, jade, path, postWirer, preWirer, replaceAll;
jade = require("jade");
path = require("path");
fs = require("fs");

replaceAll = function(string, omit, place, prevstring) {
  if (prevstring && string === prevstring) {
    return string;
  }
  prevstring = string.replace(omit, place);
  return replaceAll(prevstring, omit, place, string);
};

postWirer = function(code) {
  code = replaceAll(code, "id=", "name=");
  code = replaceAll(code, "class=", "style=");
  return replaceAll(code, "rw_if", "if");
};

preWirer = function(code) {
  code = code.replace(/\tif/g, "\trw_if".replace(/@([\w\d_\-]+)(\(?)/g, function(match, target, openparen) {
    return ("(target=\</footer>" + target + "\</footer>") + (openparen.length ? "" : ")");
  }));
  return replaceAll(code, "_if", "if");
};

genJadeFile = function(filename, upload) {
  var htmlCode, jadeCode, wireFilename;
  if (upload == null) {
    upload = false;
  }
  jadeCode = fs.readFileSync(filename, "utf8");
  htmlCode = jade.render(preWirer(jadeCode), {
    filename: filename,
    pretty: true
  });
  wireFilename = filename.slice(0, -4) + "wire";
  fs.writeFile(wireFilename, postWirer(htmlCode), function(err) {
    console.log("δ " + wireFilename);
    if (err) {
      throw err;
    }
  });
};

genAll = function() {
  var filename, _i, _len, _ref;
  _ref = fs.readdirSync("./");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    filename = _ref[_i];
    if (filename.slice(-4) === "jade") genJadeFile(filename);
  }
};

var srcFW;
genAll();
srcFW = fs.watch("./", {
  interval: 500
});
srcFW.on("change", function(event, filename) {
  if (event !== "change" || filename == null || filename.slice(-4) !== "jade") return;
  genJadeFile(filename);
});
