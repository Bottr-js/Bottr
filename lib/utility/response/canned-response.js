const random = require('../unique-random');

class CannedResponse {
  constructor(...responses) {
    this.responses = responses;
    this.random = random(0, this.responses.length - 1);
  }
  get() {
    return this.responses[this.random()];
  }
}

module.exports = CannedResponse;
