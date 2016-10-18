const StringMatcher = require('./string-matcher');
const RegExpMatcher = require('./regexp-matcher');

function ArrayMatcher(array) {
  const matchers = array.map((pattern) => {
    if (typeof pattern === 'string' || pattern instanceof String) {
      return new StringMatcher(pattern);
    } else if (pattern instanceof RegExp) {
      return new RegExpMatcher(pattern);
    }
    return pattern;
  });

  return (message) => {
    const matches = matchers.filter(matcher =>
      matcher(message)
    );

    return matches.length > 0;
  };
}

module.exports = ArrayMatcher;
