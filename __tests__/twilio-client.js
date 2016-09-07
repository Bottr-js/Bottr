jest.unmock('../lib/twilio-client')

var Bot = require('../lib/bot')
var TwilioClient = require('../lib/twilio-client')

var bot = new Bot()


//
//     bot.on('webhook', function(req, res, next) {
//
//       // If this isn't a twillio request then carry on with other handlers
//       if ( req.headers['user-agent'].indexOf('TwilioProxy') === -1 ) {
//         next()
//         return
//       }
//
//       var data = Object.assign({}, req.query, req.body)
//
//       var message = {
//         text: data.Body
//       }
//
//       var session = new Session(data.From, {}, this)
//
//       bot.trigger('message_received', message, session)
//       res.send({}) // We can't send a success code as twillio will send it
//     })]


//   var defaults = {
//     account_sid: process.env.TWILIO_ACCOUNT_SID,
//     auth_token: process.env.TWILIO_AUTH_TOKEN,
//     phone_number: process.env.TWILIO_PHONE_NUMBER
//   }

test('should use enviromental variables for sid, token and phone number', () => {

  process.env.TWILIO_ACCOUNT_SID = 'sid'
  process.env.TWILIO_AUTH_TOKEN = 'token'
  process.env.TWILIO_PHONE_NUMBER = 'number'

  var client = new TwilioClient(bot)

  expect(client.config.account_sid).toEqual('sid')
  expect(client.config.auth_token).toEqual('token')
  expect(client.config.phone_number).toEqual('number')

  process.env.TWILIO_ACCOUNT_SID = undefined
  process.env.TWILIO_AUTH_TOKEN = undefined
  process.env.TWILIO_PHONE_NUMBER = undefined
});

test('should use configuration object for key, secrets and tokens', () => {

  var config = {
    account_sid: 'sid',
    auth_token: 'token',
    phone_number: 'number'
  }

  var client = new TwilioClient(bot, config)

  expect(client.config.account_sid).toEqual('sid')
  expect(client.config.auth_token).toEqual('token')
  expect(client.config.phone_number).toEqual('number')
});

test('should send text when sending message', () => {

  var client = new TwilioClient(bot, {
    phone_number: '1'
  })

  client.send({
    user: '1'
  }, 'text')

  expect(client.twilio.sendMessage).toBeCalledWith({
      to: '1',
      from: '1',
      body: 'text'
  })
});
