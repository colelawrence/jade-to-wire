var jade = require("jade")
var keywords = [
  "if", "else",
  "each", "for",
  "case", "when", "default",
  "include", "mixin",
  "extends", "block"
]
var replaceAll = function(string, omit, place, prevstring) {
  if (prevstring && string === prevstring) {
    return string;
  }
  prevstring = string.replace(omit, place);
  return replaceAll(prevstring, omit, place, string);
};

postWirer = function(code) {
  code = replaceAll(code, " id=", " name=");
  code = replaceAll(code, " class=", " style=");
  code = replaceAll(code, "<div", "<panel");
  code = replaceAll(code, "</div", "</panel");
  return code.replace(/(<|<\/)rw_(\w+)/g, "$1$2");
};

preWirer = function(code) {
  code = code.replace(/@([\w\d_\-]+)(\(?)/g, function(match, target, openparen) {
    return ("(target=\"" + target + "\"") + (openparen.length ? "" : ")");
  });
  keywords.forEach(function (E) {
    code = code.replace(new RegExp("\\b_" + E + "\\b","g"), "rw_" + E);
  })
  return code
};

exports.render = function (jadeCode, jadeLocals, filename) {
  if (jadeLocals == null) jadeLocals = {}
  var jadeOptions = {
    locals: jadeLocals,
    pretty: true
  }
  if (typeof filename === "string") jadeOptions.filename = filename
  return postWirer(jade.render(preWirer(jadeCode), jadeOptions));
}