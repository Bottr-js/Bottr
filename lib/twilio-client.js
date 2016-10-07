var Session = require('./session')

// Currently this client only supports texts but in the future could support calls
function TwilioClient(config) {

  return function(bot) {

    var defaults = {
      account_sid: process.env.TWILIO_ACCOUNT_SID,
      auth_token: process.env.TWILIO_AUTH_TOKEN,
      phone_number: process.env.TWILIO_PHONE_NUMBER
    }

    this.bot = bot
    this.config = Object.assign({}, defaults, config)
    this.twilio = require('twilio')(this.config.account_sid, this.config.auth_token);

    this.bot.on('webhook', this.createWebhookHandler())

    return this

  }.bind(this)

}

TwilioClient.prototype.createWebhookHandler = function() {
  return function(req, res, next) {

    // If this isn't a twillio request then carry on with other handlers
    if ( req.headers['user-agent'].indexOf('TwilioProxy') === -1 ) {
      next()
      return
    }

    var data = Object.assign({}, req.query, req.body)

    var message = {
      text: data.Body
    }

    var session = new Session(this.bot, data.From, this)

    this.bot.trigger('message_received', message, session)
    res.send({}) // We can't send a success code as twillio will send it

    return session

  }.bind(this)
}

TwilioClient.prototype.send = function(session, text) {
  this.twilio.sendMessage({
      to: session.user,
      from: this.config.phone_number,
      body: text
  });
}

TwilioClient.prototype.startTyping = function(session) {
}

module.exports = TwilioClient
