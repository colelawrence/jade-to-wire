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
var html2jade
exports.toJade = function (html, cb) {
  if (html2jade == null) html2jade = require("html2jade")
  keywords.forEach(function (E) {
    html = html.replace(new RegExp("(<|</)" + E + "\\b","g"), "$1_" + E);
  })

  html = replaceAll(html, " id=", " rw_id=")
  html = replaceAll(html, " name=", " id=")
  html = replaceAll(html, " class=", " rw_class=")
  html = replaceAll(html, " style=", " class=")
  html = html.replace(/<([_\w\d]+)[^>]+\/>/g, function(match, tagname) {
      return match.replace("\/>", "></" + tagname + ">");
    })
  var tagnames = {}
  html = html.replace(/(<|<\/)([_\w\d]+)/g, function(match, chev, tagname) {
      tagnames[tagname] = true
      return chev + "rw_" + tagname
    })
  html = "<html>\n<body>\n<html>\n<body>\n" + html + "\n</body>\n</html>\n</body>\n</html>"
  html2jade.convertHtml(html, {}, function (err, jade) {
    var newJade = ""
    jade.split("\n").forEach(function(line, index){
      if (index < 4) return;
      newJade += line.slice(8) + "\n"
    })
    jade = newJade
    jade = replaceAll(jade, "rw_id=", "id=")
    jade = replaceAll(jade, "rw_class=", "class=")
    Object.keys(tagnames).forEach(function (E) {
        jade = jade.replace(new RegExp("\\brw_" + E + "\\b","g"), E);
      })
    cb(jade)
  })
}
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
var jade
exports.render = function (jadeCode, jadeOptions, filename) {
  if (jade == null) jade = require("jade")
  if (jadeOptions == null) jadeOptions = {}
  jadeOptions.pretty = true
  if (typeof filename === "string") jadeOptions.filename = filename
  return postWirer(jade.render(preWirer(jadeCode), jadeOptions));
}
exports.toWire = function (jade, locals, cb) {
  if (jade == null) jade = require("jade")
  cb(exports.render(jade, locals))
}