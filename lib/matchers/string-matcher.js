function StringMatcher(string) {
  return message =>
    message.text === string;
}

module.exports = StringMatcher;
