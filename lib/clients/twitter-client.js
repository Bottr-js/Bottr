const Session = require('../session');
const Twit = require('twit');
const BaseClient = require('./base-client');

class TwitterClient extends BaseClient {
  init() {
    const defaults = {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    };

    this.config = Object.assign({}, defaults, this.config);

    this.twit = new Twit({
      consumer_key: this.config.consumer_key,
      consumer_secret: this.config.consumer_secret,
      access_token: this.config.access_token,
      access_token_secret: this.config.access_token_secret,
    });

    this.stream = this.twit.stream('statuses/filter', { track: `@${this.bot.name}` });
    this.stream.on('tweet', this.createTweetHandler());
  }

  createEventHandler() {
    return (req, res, next) => {
      // If this isn't a websocket request then carry on with other handlers
      if (!{}.hasOwnProperty.call(req.query, 'twitter')) {
        next();
        return;
      }

      // TODO: Implement For Twitter
    };
  }

  createTweetHandler() {
    return (tweet) => {
      const session = new Session(this.bot, tweet.user.id, this);

      this.bot.trigger('message_received', {
        text: tweet.text,
      }, session);

      return session;
    };
  }

  send(session, text) {
    // Reply to that tweet
    this.twit.post('statuses/update', { status: text });
  }
}

module.exports = TwitterClient;
