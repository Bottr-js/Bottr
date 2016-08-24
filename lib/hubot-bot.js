var Botkit = require('botkit');
var CoffeeScript = require('coffee-script');
CoffeeScript.register();
var Hubot = require('hubot');

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

function HubotBot(config) {

  // Create a core botkit bot
  var hubot_botkit = Botkit.core(Object.assign({}, config))

  // customize the bot definition, which will be used when new connections
  // spawn!
  hubot_botkit.defineBot(function(botkit, config) {

      var bot = {
          botkit: botkit,
          config: Object.assign({
            name: 'pozi',
            client: 'shell'
          }, config || {}),
          utterances: botkit.utterances,
      };

      var hubot = Hubot.loadBot(null, bot.config.client, true, bot.config.name, null)

      bot.startConversation = function(utterance, cb) {
          botkit.startConversation(this, utterance, cb);
      };

      bot.reply = function(utterance, response, cb) {

        utterance.send(response)

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

      console.log(bot.config.name + " is listening on PORT " + process.env.PORT)
      hubot.run()
  })

  return hubot_botkit
}

module.exports = HubotBot
