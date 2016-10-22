const CannedResponse = require('./canned-response');

class Greetings extends CannedResponse {
  constructor() {
    super('Hello',
          'Hi',
          'Hey',
          'What\'s up',
          'Good day');
  }
}

module.exports = new Greetings();
