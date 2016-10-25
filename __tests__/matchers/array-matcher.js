jest.unmock('../../lib/matchers/array-matcher');

const ArrayMatcher = require('../../lib/matchers/array-matcher');

it('should match message if one matcher in the array matches', () => {
  const matcher = () => true;
  expect(new ArrayMatcher([matcher])({
    text: 'match',
  })).toBe(true);
});
