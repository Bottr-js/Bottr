jest.unmock('../lib/bot');

describe('bot', () => {
  it('throws error when no configuration is provided', () => {
    const Bot = require('../lib/bot');
    expect(() => new Bot() ).toThrow();
  });

  it('throws error when no client is provided', () => {
    const Bot = require('../lib/bot');
    expect(() => new Bot({
      router: () => {}
    }) ).toThrow();
  });

  it('throws error when no router is provided', () => {
    const Bot = require('../lib/bot');
    expect(() => new Bot({
      client: {}
    })).toThrow();
  });
});
