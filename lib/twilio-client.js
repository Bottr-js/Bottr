var Session = require('./session')

// Currently this client only supports texts but in the future could support calls
function TwilioClient(config) {

  var defaults = {
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    phone_number: process.env.TWILIO_PHONE_NUMBER
  }

  this.config = Object.assign({}, defaults, config)
  this.twilio = require('twilio')(client.config.account_sid, client.config.auth_token);

  var client = this

  return function(bot) {

    bot.on('webhook', function(req, res, next) {

      // If this isn't a twillio request then carry on with other handlers
      if ( req.headers['user-agent'].indexOf('TwilioProxy') === -1 ) {
        next()
        return
      }

      var data = Object.assign({}, req.query, req.body)

      var message = {
        text: data.Body
      }

      var session = new Session(data.From, {}, this)

      bot.trigger('message_received', message, session)
      res.send({}) // We can't send a success code as twillio will send it
    })
  }
}

TwilioClient.prototype.send = function(session, text) {

  this.twilio.sendMessage({

      to: meta.user,
      from: this.config.phone_number,
      body: text

  }, function(err, responseData) {

      if (!err) {
          console.log(responseData.from);
          console.log(responseData.body);
      }
  });
}

TwilioClient.prototype.startTyping = function(session) {
}

module.exports = TwilioClient
