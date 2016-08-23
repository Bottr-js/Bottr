var Neurotin = require('./lib/neurotin')
var bot = new Neurotin.Bot();

bot.on('message_received', function(bot, message) {

  bot.storage.users.get(message.user, function(err, context) {
      // Default values for if this is the first time
      // communicating with the bot
      var defaults = {
        messageCount: 0,
        wordCount: 0
      }

      // Merge current context with the defaults.
      var context = Object.assign({}, defaults, (context) ? context.context : {})

      // Increment the message count and
      // calculate the new number of words the user has sent
      //
      // FIXME: Why do we need to text.text on an event but not a listener
      var messageCount = context.messageCount + 1;
      var wordCount = context.wordCount + message.text.text.split(" ").length;

      // Merge the new statistics into the context
      // and return it back to the bot
      bot.storage.users.save({
        id: message.user,
        context: Object.assign({}, context, {
          messageCount: messageCount,
          wordCount: wordCount
        })
      }, function(){});
  });
})

bot.hears(['\/stats'], ['message_received'], function(bot, message) {
    bot.storage.users.get(message.user, function(err, context) {
      // Send the total number of messages to the
      // user
      bot.reply(message, "Total Message Count: " + context.context.messageCount)

      // Send the total number of words to the
      // user
      bot.reply(message, "Total Word Count: " + context.context.wordCount)

      //
      // We don't do anything to the context
      // so we just return it
      //return request.context
    });
});

bot.hears([/.+/], ['message_received'], function(bot, message) {
    bot.reply(message, message.text);
});

bot.start()
