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
  this.botkitBot.on(event, callback)
}

Bot.prototype.hears = function(patterns, eventFilter, callback) {
  this.botkitBot.hears(patterns, eventFilter, callback)
}

Bot.prototype.spawn = function(config) {
  this.botkitBot.spawn(config)
}

module.exports = {
  Bot: Bot
}
