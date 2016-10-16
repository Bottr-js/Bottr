const Twilio = require('twilio');
const Session = require('../session');
const BaseClient = require('./base-client');

// Currently this client only supports texts but in the future could support calls
class TwilioClient extends BaseClient {
  init() {
    const defaults = {
      account_sid: process.env.TWILIO_ACCOUNT_SID,
      auth_token: process.env.TWILIO_AUTH_TOKEN,
      phone_number: process.env.TWILIO_PHONE_NUMBER,
    };

    this.config = Object.assign({}, defaults, this.config);
    this.twilio = Twilio(this.config.account_sid, this.config.auth_token);

    this.bot.on('webhook', this.createWebhookHandler());
  }

  createEventHandler() {
    return (req, res, next) => {
      // If this isn't a websocket request then carry on with other handlers
      if (!{}.hasOwnProperty.call(req.query, 'twilio')) {
        next();
        return;
      }

      // TODO: Implement For Twilio
    };
  }

  createWebhookHandler() {
    return (req, res, next) => {
      // If this isn't a twillio request then carry on with other handlers
      if (req.headers['user-agent'].indexOf('TwilioProxy') === -1) {
        next();
        return;
      }

      const data = Object.assign({}, req.query, req.body);

      const message = {
        text: data.Body,
      };

      const session = new Session(this.bot, data.From, this);

      this.bot.trigger('message_received', message, session);
      res.send({}); // We can't send a success code as twillio will send it

      return session;
    };
  }

  send(session, text) {
    this.twilio.sendMessage({
      to: session.user,
      from: this.config.phone_number,
      body: text,
    });
  }
}

module.exports = TwilioClient;
