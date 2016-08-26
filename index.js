var Pozi = require('./lib')
var WebhookClient = require('./lib/webhook-client');

var bot = new Pozi.Bot2()

bot.use(new WebhookClient())

// bot.on('messaged_recieved', function(message, session, next) {
//  - Update Stats
// next()
// })

// bot.hears(/\\stats/, function(message, session) {
// - Send stats
// })

bot.hears(/.+/, function(message, session) {
  session.send(message.text)
})

bot.listen(process.env.PORT || 3000)

//module.exports = require('./lib')
