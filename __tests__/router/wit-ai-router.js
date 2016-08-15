jest.unmock('../../lib/router/wit-ai-router');

jest.setMock('node-wit', function() {

})

const WitAIRouter = require('../../lib/router/wit-ai-router');

describe('Wit.ai router', () => {

  it('throws error when no api token is provided', () => {
    expect(() => new WitAIRouter()).toThrow();
  });

  it('should trigger registered action', () => {

    var bot = {
      actions: {
        send: jest.fn()
      }
    }

    var request = {
      user: {
        conversationID: ""
      },
      message: "",
      context: {}
    }

    var router = new WitAIRouter({ apiToken: 'Token' })
    router(bot, request, jest.fn)

    expect(bot.actions.send).toBeCalled();
  });

  it('should call callback when finished', () => {

    var bot = {
      actions: {
        send: jest.fn()
      }
    }

    var request = {
      user: {
        conversationID: ""
      },
      message: "",
      context: {}
    }

    var callback = jest.fn()

    var router = new WitAIRouter({ apiToken: 'Token' })
    router(bot, request, callback)

    expect(callback).toBeCalled();
  });
});
