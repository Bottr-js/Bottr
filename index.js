var Pozi = require('./lib')
var WebhookClient = require('./lib/webhook-client');

var bot = new Pozi.Bot2()

bot.use(new WebhookClient())

// bot.on(<event>, <cb>)

bot.hears(/.+/, function(message, session) {
  session.send('I heard "' + message.text + '"')
})

bot.listen(process.env.PORT || 3000)

//module.exports = require('./lib')
