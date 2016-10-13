jest.unmock('../../lib/matchers/array-matcher')

var ArrayMatcher = require('../../lib/matchers/array-matcher')

test('should match message if one matcher in the array matches', () => {

  var matcher = function() {
    return true
  }

  expect(new ArrayMatcher([matcher])({
    text: 'match'
  })).toBe(true)
})
