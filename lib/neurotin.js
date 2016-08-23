var CoffeeScript = require('coffee-script');
CoffeeScript.register();
var Hubot = require('hubot');
var HubotBot = require('./hubot-bot');

function Bot() {
  //adapterPath, adapterName, enableHttpd, botName, botAlias
  this.hubot = Hubot.loadBot(null, 'shell', true, 'echobot', null)
  this.botkitBot = new HubotBot(this.hubot);
}

Bot.prototype.on = function(event, callback) {
  this.botkitBot.on(event, function(bot, event) {
    callback(event, {})
  })
}

Bot.prototype.hears = function(patterns, eventFilter, callback) {
  this.botkitBot.hears(patterns, eventFilter, function(bot, message) {
    //console.log(message)
  })
}

Bot.prototype.spawn = function(config) {
  this.botkitBot.spawn(config)
}

module.exports = {
  Bot: Bot
}
