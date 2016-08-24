var CoffeeScript = require('coffee-script');
CoffeeScript.register();
var Hubot = require('hubot');
var HubotBot = require('./hubot-bot');
var Context = require('./context');
var Middleware = require('./middleware');

function Bot() {
  //adapterPath, adapterName, enableHttpd, botName, botAlias
  this.hubot = Hubot.loadBot(null, 'shell', true, 'echobot', null)
  this.botkitBot = new HubotBot(this.hubot);
  this.middleware = new Middleware(this.botkitBot.storage, this.botkitBot.middleware)
}

Bot.prototype.on = function(event, callback) {
  this.botkitBot.on(event, this.createHandler('event', callback))
}

Bot.prototype.hears = function(patterns, eventFilter, middleware_or_callback, callback) {

  if (callback) {
      this.botkitBot.hears(patterns, eventFilter, middleware_or_callback, this.createHandler('listener ' + patterns, callback))
  } else {
      this.botkitBot.hears(patterns, eventFilter, this.createHandler('listener ' + patterns, middleware_or_callback))
  }
}

Bot.prototype.spawn = function(config) {
  this.botkitBot.spawn(config)
}

Bot.prototype.reply = function(subject, message) {
  this.botkitBot.reply(subject, message)
}

Bot.prototype.changeEars = function(ears) {
  this.botkitBot.changeEars(ears)
}

Bot.prototype.createHandler = function(name, callback) {

  var botkitBot = this.botkitBot

  return function(bot, subject) {

    var context = new Context(botkitBot.storage, subject)

    console.log(name)
    context.fetch().then(function() {
      callback(subject, context)
      context.save()
    })
  }
}

module.exports = {
  Bot: Bot
}
