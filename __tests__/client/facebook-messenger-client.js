jest.unmock('../../lib/client/facebook-messenger-client');

jest.setMock('messenger-bot', function(config) {
  this.config = config

  this.on = function(name, callback) {
    this.callback = callback;
  }

  this.triggerMessageSent = function() {
    this.callback({
      message: { text: "" }, sender: { id: "" }
    });
  }

  this.middleware = jest.fn()
  this.sendMessage = jest.fn()
})

const FacebookMessengerClient = require('../../lib/client/facebook-messenger-client');

describe('facebook messenger client', () => {

  it('throws error when no page access token is provided', () => {
    expect(() => new FacebookMessengerClient()).toThrow();
  });

  it('throws error when no validation secret is provided', () => {
    expect(() => new FacebookMessengerClient({
      pageAccessToken: 'Token'
    })).toThrow();
  });

  it('throws error when no app secret is provided', () => {
    expect(() => new FacebookMessengerClient({
      pageAccessToken: 'Token',
      validationSecret: 'Secret'
    })).toThrow();
  });

  it('constructs messenger bot with configuration options', () => {

    var options = {
      pageAccessToken: 'Token',
      validationSecret: 'Secret',
      appSecret: 'Secret'
    }

    var client = new FacebookMessengerClient(options)

    expect(client.messenger.config.token).toEqual(options.pageAccessToken)
    expect(client.messenger.config.verify).toEqual(options.validationSecret)
    expect(client.messenger.config.app_secret).toEqual(options.appSecret)
  });

  it('forwards message to bot when recieved from user', () => {

    var options = {
      pageAccessToken: 'Token',
      validationSecret: 'Secret',
      appSecret: 'Secret'
    }

    var client = new FacebookMessengerClient(options)
    var bot = {
      didRecieveMessage: jest.fn()
    }

    client.start(bot)
    client.messenger.triggerMessageSent()

    expect(bot.didRecieveMessage).toBeCalled()
  })


  it('sends message from bot to user', () => {
    var options = {
      pageAccessToken: 'Token',
      validationSecret: 'Secret',
      appSecret: 'Secret'
    }

    var client = new FacebookMessengerClient(options)

    client.send('Make technology great again', { id: '' })

    expect(client.messenger.sendMessage).toBeCalled()
  })
});
