jest.unmock('../../lib/matchers/regexp-matcher')

var RegexpMatcher = require('../../lib/matchers/regexp-matcher')

test('should match message which matches regular expression', () => {
  expect(new RegexpMatcher(/match/)({
    text: 'match'
  })).toBe(true);
});
