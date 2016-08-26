var Pozi = require('./lib')
var WebhookClient = require('./lib/webhook-client');

var bot = new Pozi.Bot2()

// - Are datastores just middleware ?
bot.use(new WebhookClient())

// bot.on('messaged_recieved', function(message, session, next) {
//  - Update Stats
// next()
// })

bot.hears(/\/stats/, function(message, session) {
  session.send("I would send stats right now")
})

bot.hears(/.+/, function(message, session) {
  session.send(message.text)
})

bot.listen(process.env.PORT || 3000)

//module.exports = require('./lib')
