var CoffeeScript = require('coffee-script');
CoffeeScript.register();
var Botkit = require('botkit');
var Hubot = require('hubot');

function HubotBot(hubot) {

  // Create a core botkit bot
  var hubot_botkit = Botkit.core({})

  // customize the bot definition, which will be used when new connections
  // spawn!
  hubot_botkit.defineBot(function(botkit, config) {

      var bot = {
          botkit: botkit,
          config: config || {},
          utterances: botkit.utterances,
      };

      bot.startConversation = function(message, cb) {
          botkit.startConversation(this, message, cb);
      };

      bot.send = function(message, cb) {

        message.res.send(message.text)

        if (cb) {
          cb()
        }
      };

      bot.reply = function(src, resp, cb) {

        src.res.reply(resp)

        if (cb) {
          cb()
        }
      };

      bot.findConversation = function(message, cb) {

          botkit.debug('CUSTOM FIND CONVO', message.user, message.channel);
          // - Load from context store

          if (cb) {
            cb();
          }
      };

      console.log("Attaching listeners For \"" + hubot.name + "\"...")

      hubot.hear(/./, function(res){
        var message = {
            res: res,
            text: res.message,
            user: res.user
        };

        hubot_botkit.receiveMessage(bot, message);
      })

      hubot.respond(/./, function(res) {
        var message = {
            res: res,
            text: res.message,
            user: res.user
        };

        hubot_botkit.receiveMessage(bot, message);
      })

      console.log("\"" + hubot.name + "\" started...")

      hubot.run()
  })

  return hubot_botkit
}

function Neurotin(bot) {

  bot.on('message_received', function() {
    console.log('fuck')

    //
    //   // Default values for if this is the first time
    //   // communicating with the bot
    //   var defaults = {
    //     messageCount: 0,
    //     wordCount: 0
    //   }
    //
    //   // Merge current context with the defaults.
    //   var context = Object.assign({}, defaults, request.context)
    //
    //   // Increment the message count and
    //   // calculate the new number of words the user has sent
    //   var messageCount = context.messageCount + 1;
    //   var wordCount = context.wordCount + request.message.split(" ").length;
    //
    //   // Merge the new statistics into the context
    //   // and return it back to the bot
    //   return Object.assign({}, context, {
    //     messageCount: messageCount,
    //     wordCount: wordCount
    //   })
  })

  bot.hears(['\/stats'], ['message_received'], function(bot, message) {
      bot.reply(message, 'Stats would be calculated here');

      //
      //   // Send the total number of messages to the
      //   // user
      //   bot.speak({
      //     message: "Total Message Count: " + request.context.messageCount
      //   }, request)
      //
      //   // Send the total number of words to the
      //   // user
      //   bot.speak({
      //     message: "Total Word Count: " + request.context.wordCount
      //   }, request)
      //
      //   // We don't do anything to the context
      //   // so we just return it
      //   return request.context
  });

  bot.hears([/.+/], ['message_received'], function(bot, message) {
      bot.reply(message, message.text);
  });
}

console.log('Starting Neurotin....')

//adapterPath, adapterName, enableHttpd, botName, botAlias
var hubot = Hubot.loadBot(null, 'shell', true, 'echobot', null)
var bot = new HubotBot(hubot);
var neurotin = new Neurotin(bot)

bot.spawn()
