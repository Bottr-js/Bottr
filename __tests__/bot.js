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

  it('starts context store when started', () => {

    var contextStore = {
      start: jest.fn()
    }

    var bot = new Bot({
      contextStore: contextStore,
      client: {},
      router: () => {}
    })

    bot.start()

    expect(contextStore.start).toBeCalled()
  });

  it('starts client when started', () => {

    var client = {
      start: jest.fn()
    }

    var bot = new Bot({
      client: client,
      router: () => {}
    })

    bot.start()

    expect(client.start).toBeCalled()
  });

  it('starts client when started after context store has started', () => {

    var client = {
      start: jest.fn()
    }

    var contextStore = {
      start: function(callback) {
        callback();
      }
    }

    var bot = new Bot({
      contextStore: contextStore,
      client: client,
      router: () => {}
    })

    bot.start()

    expect(client.start).toBeCalled()
  });
});
