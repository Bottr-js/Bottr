function RegExpMatcher(regexp) {
  return function(message) {
    return regexp.test(message.text)
  }
}

module.exports = RegExpMatcher
