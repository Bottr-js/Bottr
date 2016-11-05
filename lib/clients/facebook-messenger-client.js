const request = require('request');
const Session = require('../session');
const BaseClient = require('./base-client');

class FacebookMessengerClient extends BaseClient {
  init() {
    const defaults = {
      verify_token: process.env.MESSENGER_VERIFY_TOKEN,
      access_token: process.env.MESSENGER_ACCESS_TOKEN,
      graph_uri: 'https://graph.facebook.com',
    };

    this.config = Object.assign({}, defaults, this.config);

    this.bot.on('webhook', this.createWebhookHandler());
  }

  createEventHandler() {
    return (req, res, next) => {
      // If this isn't a websocket request then carry on with other handlers
      if (!{}.hasOwnProperty.call(req.query, 'facebook')) {
        next();
        return;
      }

      const data = Object.assign({}, req.query, req.body);
      const session = new Session(this.bot, data.user, this);
      this.bot.trigger(`${data.event}_event`, data.data, session);

      res.success();
    };
  }

  createWebhookHandler() {
    return (req, res, next) => {
      // If this isn't a facebook request then carry on with other handlers
      if (!{}.hasOwnProperty.call(req.headers, 'x-hub-signature') &&
        req.headers['user-agent'].indexOf('facebookplatform') === -1) {
        next();
        return;
      }

      const query = req.query;

      if (query['hub.mode'] === 'subscribe') {
        this.handleSubscription(req, res);
      } else {
        this.handleEvent(this.bot, req, res);
      }
    };
  }

  handleSubscription(req, res) {
    const query = req.query;

    if (query['hub.verify_token'] === this.config.verify_token) {
      res.send(query['hub.challenge']);
    } else {
      res.sendStatus(403);
    }
  }

  handleEvent(bot, req, res) {
    const client = this;
    const body = req.body;

    if (body.object === 'page') {
      res.status(200);

      body.entry.forEach((pageEntry) => {
        pageEntry.messaging.forEach((messagingEvent) => {
          if (messagingEvent.message) {
            client.receivedMessage(bot, messagingEvent);
          } else {
            console.error('Webhook received unknown messagingEvent: ', messagingEvent);
            res.status(400);
          }
        });
      });

      res.end();
    } else {
      res.sendStatus(400);
    }
  }

  receivedMessage(bot, event) {
    const senderID = event.sender.id;
    const message = event.message;

    const session = new Session(bot, senderID, this);

    bot.trigger('message_received', message, session);

    return session;
  }

  send(session, text, attachment) {
    console.log(`Sending "${text}"`);

    const messageData = {
      recipient: {
        id: session.user,
      },
      message: {},
    };

    if (text) {
      messageData.message.text = text;
    }

    if (attachment) {
      messageData.message.attachment = {
        type: attachment.type,
        url: attachment.url,
      };
    }

    return request({
      uri: `${this.config.graph_uri}/v2.6/me/messages`,
      qs: { access_token: this.config.access_token },
      method: 'POST',
      json: messageData,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('Successfully sent message.');
      } else {
        console.error('Unable to send message. Please verify your access_token.');
      }
    });
  }

  startTyping(session) {
    const messageData = {
      recipient: {
        id: session.user,
      },
      sender_action: 'typing_on',
    };

    return request({
      uri: `${this.config.graph_uri}/v2.6/me/messages`,
      qs: { access_token: this.config.access_token },
      method: 'POST',
      json: messageData,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('Successfully started typing indicator.');
      } else {
        console.error('Unable to start typing indicator. Please verify your access_token ');
      }
    });
  }
}

module.exports = FacebookMessengerClient;
