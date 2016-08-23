var Botkit = require('botkit');

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

      hubot.hear(/./, function(message) {
        hubot_botkit.receiveMessage(bot, message);
      })

      hubot.respond(/./, function(message) {
        hubot_botkit.receiveMessage(bot, message);
      })

      hubot.run()
  })

  return hubot_botkit
}

module.exports = HubotBot
