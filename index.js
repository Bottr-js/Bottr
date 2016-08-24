var Neurotin = require('./lib/neurotin')
var bot = new Neurotin.Bot();

// Add Middleware to Neurotin
bot.middleware.receive.use(function(utterance, context, next) {
    // Default values for if this is the first time
    // communicating with the bot
    var defaults = {
      messageCount: 0,
      wordCount: 0
    }

    // Merge current context with the defaults.
    context.user = Object.assign(defaults, context.user)
    var text = utterance.text

    // Increment the message count and
    // calculate the new number of words the user has sent
    //
    var messageCount = context.user.messageCount + 1;
    var words = text.split(" ");
    var wordCount = context.user.wordCount + words.length;

    // Merge the new statistics into the context
    // and return it back to the bot
    context.user = Object.assign(context.user, {
      messageCount: messageCount,
      wordCount: wordCount
    })

    next();
});

bot.hears(['\/stats'], ['message_received'], function(utterance, context) {

    // Send the total number of messages to the
    // user
    utterance.reply("Total Message Count: " + context.user.messageCount)

    // Send the total number of words to the
    // user
    utterance.reply("Total Word Count: " + context.user.wordCount)
});

bot.hears([/.+/], ['message_received'], function(utterance, context) {
  utterance.reply(utterance.text);
});

bot.spawn()
