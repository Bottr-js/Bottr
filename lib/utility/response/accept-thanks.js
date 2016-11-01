const CannedResponse = require('./canned-response');

class AcceptThanks extends CannedResponse {
  constructor() {
    super('That\'s all right.',
          'You\'re welcome.',
          'You\'re very welcome.',
          'Don\'t mention it.',
          'Not at all.',
          'It wasn\'t a problem at all.',
          'It\'s nothing.',
          'It\'s my pleasure.',
          'The pleasure is all mine.',
          'My pleasure.');
  }
}

module.exports = new AcceptThanks();
