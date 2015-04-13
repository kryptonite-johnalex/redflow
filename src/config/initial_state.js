var utils = require("../lib/utils"),
    _ = require("mori");

function times(n, fn) {
  var results = [];
  for (var i = 0; i < n; i++) {
    results.push(fn(i));
  }
  return results;
}

module.exports = {
};
