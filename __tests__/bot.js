jest.unmock('../lib/bot');

describe('bot', () => {
  it('throws error when no configuration is provided', () => {
    const Bot = require('../lib/bot');
    expect(() => new Bot() ).toThrow();
  });
});
