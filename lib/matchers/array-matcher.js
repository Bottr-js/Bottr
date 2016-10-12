var StringMatcher = require('./string-matcher')
var RegExpMatcher = require('./regexp-matcher')

function ArrayMatcher(array) {

  var matchers = array.map(function(pattern) {
    if (typeof pattern == 'string' || pattern instanceof String) {
      return new StringMatcher(pattern)
    } else if(pattern instanceof RegExp) {
      return new RegExpMatcher(pattern)
    } else {
      return pattern
    }
  })

  return function(message) {

    var matches = matchers.filter(function(matcher) {
      return matcher(message)
    })

    return matches.length > 0
  }
}

module.exports = ArrayMatcher
