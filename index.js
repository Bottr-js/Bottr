var Neurotin = require('./lib/neurotin')
var bot = new Neurotin.Bot();

bot.on('message_received', function(event, context) {

    // Default values for if this is the first time
    // communicating with the bot
    var defaults = {
      messageCount: 0,
      wordCount: 0
    }

    // Merge current context with the defaults.
    var context = Object.assign({}, defaults, context)

    // Increment the message count and
    // calculate the new number of words the user has sent
    //
    var messageCount = context.messageCount + 1;
    var words = event.text.split(" ");
    var wordCount = context.wordCount + words.length;

    // Merge the new statistics into the context
    // and return it back to the bot
    return Object.assign({}, context, {
      messageCount: messageCount,
      wordCount: wordCount
    })
})

bot.hears(['\/stats'], ['message_received'], function(utterance, context) {

    // Send the total number of messages to the
    // user
    bot.reply(message, "Total Message Count: " + context.messageCount)

    // Send the total number of words to the
    // user
    bot.reply(message, "Total Word Count: " + context.wordCount)

    //
    // We don't do anything to the context
    // so we just return it
    return context
});

bot.hears([/.+/], ['message_received'], function(utterance, context) {
    bot.reply(message, message.text);
});

bot.spawn()
