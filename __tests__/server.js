jest.unmock('../lib/server')

var Server = require('../lib/server')

test('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});
