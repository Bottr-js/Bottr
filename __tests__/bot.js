jest.unmock('../lib/bot');

const Bot = require('../lib/bot');

const client = {
  start: jest.fn(),
  send: jest.fn()
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

  it('triggers registered action', () => {

    var bot = new Bot({
      contextStore: contextStore,
      client: client,
      router: router
    })

    bot.start()

    expect(client.start).toBeCalled()
  });

  it('throws error for unregistered action', () => {

    var bot = new Bot({
      contextStore: contextStore,
      client: client,
      router: router
    })

    expect(() => bot.dispatch({ name: "I'm not another action" })).toThrow()
  });

  it('registers send action', () => {

    var bot = new Bot({
      contextStore: contextStore,
      client: client,
      router: router
    })

    expect(bot.actions["send"]).toBeTruthy()
  });

  it('tells client to send when send action is triggered', () => {

    var bot = new Bot({
      contextStore: contextStore,
      client: client,
      router: router
    })

    bot.send({ text: "" }, { user: {} })

    expect(client.send).toBeCalled()
  });
});
