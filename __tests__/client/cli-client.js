jest.unmock('../../lib/client/cli-client');

jest.setMock('repl', {
  start: function(config) {
    return {
      prompt: config.prompt,
      eval: config.eval,
      started: true
    }
  }
})

const CLIClient = require('../../lib/client/cli-client');

describe('cli client', () => {

  it('starts REPL when started', () => {
    var client = new CLIClient()
    client.start()
    expect(client.replServer.started).toBeTruthy()
  })

  it('sets REPL prompt', () => {
    var client = new CLIClient()
    client.start()
    expect(client.replServer.prompt).toEqual("BotKit > ")
  })

  it('forwards message to bot when recieved from user', () => {
    var client = new CLIClient()
    var bot = {
      didRecieveMessage: jest.fn()
    }

    client.start(bot)
    client.replServer.eval()

    expect(bot.didRecieveMessage).toBeCalled()
  })

  it('should call callback for repl server when bot is finished', () => {
    var client = new CLIClient()
    var bot = {
      didRecieveMessage: function(message, user, callback) {
        callback()
      }
    }
    var callback = jest.fn()

    client.start(bot)
    client.replServer.eval(null, null, null, callback)

    expect(callback).toBeCalled()
  })
});
