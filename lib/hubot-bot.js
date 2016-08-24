var Botkit = require('botkit');

function prepareUtterance(utterance) {
  return Object.assign({
    user: utterance.message.user.id,
    channel: (utterance.channel) ? utterance.channel : "SHARED",
    team: (utterance.team) ? utterance.team : "SHARED",
    text: utterance.message.text,
    reply: function(text) {
      utterance.reply(text)
    },
    send: function(text) {
      utterance.send(text)
    }
  }, utterance)
}

function HubotBot(hubot, config) {

  // Create a core botkit bot
  var hubot_botkit = Botkit.core(Object.assign({}, config))

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

      bot.send = function(utterance, cb) {

        utterance.send(utterance.text)

        if (cb) {
          cb()
        }
      };

      bot.reply = function(utterance, response, cb) {
        utterance.reply(response)

        if (cb) {
          cb()
        }
      };

      bot.findConversation = function(message, cb) {
          if (cb) {
            cb();
          }
      };

      hubot.hear(/./, function(utterance) {
        hubot_botkit.receiveMessage(bot, prepareUtterance(utterance));
      })

      hubot.respond(/./, function(utterance) {
        hubot_botkit.receiveMessage(bot, prepareUtterance(utterance));
      })

      hubot.run()
  })

  return hubot_botkit
}

module.exports = HubotBot
