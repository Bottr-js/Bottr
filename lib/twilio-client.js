// Currently this client only supports texts but in the future could support calls
function TwilioClient(config) {

  var defaults = {
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    phone_number: process.env.TWILIO_PHONE_NUMBER
  }

  this.config = Object.assign({}, defaults, config)

  var client = this

  return function(bot) {

    var twilio = require('twilio')(client.config.account_sid, client.config.auth_token);

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

      // FIXME: Move out into another function
      // FIXME: Reduce this boilerplate / make smaller
      var session = {
        user: data.From, // Object ?
        conversation: data.From, // Object ?
        account: data.From, // Object ?
        send: function(text) {

            twilio.sendMessage({

                to: data.From, // Any number Twilio can deliver to
                from: client.config.phone_number,
                body: text

            }, function(err, responseData) {

                if (!err) {
                    console.log(responseData.from); // outputs "+14506667788"
                    console.log(responseData.body); // outputs "word to your mother."
                }
            });
        }
      }

      bot.trigger('message_received', message, session)
      res.success()
    })
  }
}

module.exports = TwilioClient
