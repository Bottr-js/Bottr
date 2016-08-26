function StringMatcher(string) {
  return function(message) {
    return message.text === string
  }
}

module.exports = StringMatcher
