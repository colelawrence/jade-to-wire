var coffee = require("coffee-script")
// Based on https://github.com/bevry/cson/blob/master/src/lib/cson.coffee
exports.parse = function (src, isJson) {
  try {
    result = JSON.parse(src)
  } catch (err) {
    if (isJson)
      throw err
    // throw error for tree
    result = coffee.eval(src, { sandbox:true })
  }
  return result
}