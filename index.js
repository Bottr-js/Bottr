var Pozi = require('./lib')
var WebhookClient = require('./lib/webhook-client');

var bot = new Pozi.Bot2()

bot.use(new WebhookClient())

// - Are datastores just middleware ?

bot.on('message_received', function(message, session, next) {

  var defaults = {
    totalMessages: 0,
    totalWords: 0
  }

  var context = session.getContext(session.user, defaults)

  var words = message.text.split(" ")
  var totalMessages = context.totalMessages + 1
  var totalWords = context.totalWords + words.length

  session.updateContext(session.user, {
   totalMessages: totalMessages
   totalWord: totalWords
  })

  next()
})

bot.hears(/\/stats/, function(message, session) {

  //var context = session.getContext(session.user)
  //
  //

  session.send("I would send stats right now")
})

bot.hears(/.+/, function(message, session) {
  session.send(message.text)
})

bot.listen(process.env.PORT || 3000)

//module.exports = require('./lib')
