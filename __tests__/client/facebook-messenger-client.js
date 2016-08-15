jest.unmock('../../lib/client/facebook-messenger-client');

jest.setMock('messenger-bot', function(config) {
  this.config = config
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
});
