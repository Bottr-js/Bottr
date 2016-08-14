jest.unmock('../lib/bot');

const Bot = require('../lib/bot');

describe('bot', () => {
  it('throws error when no configuration is provided', () => {
    expect(() => new Bot() ).toThrow();
  });

  it('throws error when no client is provided', () => {
    expect(() => new Bot({
      router: () => {}
    }) ).toThrow();
  });

  it('throws error when no router is provided', () => {
    expect(() => new Bot({
      client: {}
    })).toThrow();
  });
});
