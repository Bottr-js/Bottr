class BaseClient {
  constructor(config) {
    const client = (bot) => {
      this.bot = bot;
      this.config = config;
      if (this.init) {
        this.init();
      }
      return this;
    };
    return client.bind(this);
  }

  /**
   * Sends a new message.
   *
   * @param {Object} session
   * @param {String} text
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  send(session, text) {
    // do nothing
  }

  /**
   * Callback function when the client starts typing.
   *
   * @param {Object} session
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  startTyping(session) {
    // do nothing
  }
}

module.exports = BaseClient;
