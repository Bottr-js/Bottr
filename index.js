var Pozi = require('./lib')
var bot = new Pozi.Bot2()

bot.use(new Pozi.WebhookClient())
bot.use(new Pozi.MemoryStorage())

bot.on('message_received', function(message, session, next) {

  var defaults = {
    totalMessages: 0,
    totalWords: 0
  }

  var context = session.getUserContext(defaults)

  var words = message.text.split(" ")
  var totalMessages = context.totalMessages + 1
  var totalWords = context.totalWords + words.length

  session.updateUserContext({
   totalMessages: totalMessages,
   totalWords: totalWords
  })

  next()
})

bot.hears(/\/stats/, function(message, session) {

  var context = session.getUserContext()

  session.send("Total Messages Sent: " + context.totalMessages)
  session.send("Total Words Sent: " + context.totalWords)
})

bot.hears(/.+/, function(message, session) {
  session.send(message.text)
})

bot.listen(process.env.PORT || 3000)

//module.exports = require('./lib')
