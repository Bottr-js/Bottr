jest.unmock('../lib/bot');

const Bot = require('../lib/bot');

const client = {
  start: jest.fn()
}

const router = jest.fn()

const contextStore = {
  start: jest.fn()
}

describe('bot', () => {
  it('throws error when no configuration is provided', () => {
    expect(() => new Bot()).toThrow();
  });

  it('throws error when no client is provided', () => {
    expect(() => new Bot({
      router: router
    })).toThrow();
  });

  it('throws error when no router is provided', () => {
    expect(() => new Bot({
      client: client
    })).toThrow();
  });

  it('starts context store when started', () => {

    var bot = new Bot({
      contextStore: contextStore,
      client: client,
      router: router
    })

    bot.start()

    expect(contextStore.start).toBeCalled()
  });

  it('starts client when started', () => {

    var bot = new Bot({
      client: client,
      router: router
    })

    bot.start()

    expect(client.start).toBeCalled()
  });

  it('starts client after context store has started', () => {

    var bot = new Bot({
      contextStore: contextStore,
      client: client,
      router: router
    })

    bot.start()

    expect(client.start).toBeCalled()
  });
});
