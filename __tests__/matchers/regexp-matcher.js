jest.unmock('../../lib/matchers/regexp-matcher');

const RegexpMatcher = require('../../lib/matchers/regexp-matcher');

it('should match message which matches regular expression', () => {
  expect(new RegexpMatcher(/match/)({
    text: 'match',
  })).toBe(true);
});
