jest.unmock('../../lib/client/facebook-messenger-client');

jest.setMock('messenger-bot', function() {
  
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
});
