var CoffeeScript = require('coffee-script');
CoffeeScript.register();
var Hubot = require('hubot');
var HubotBot = require('./hubot-bot');
var Context = require('./context');
var Middleware = require('./middleware');
var applySubjectToBot = require('./apply-subject-to-bot');

function Bot(config) {
  //adapterPath, adapterName, enableHttpd, botName, botAlias
  this.hubot = Hubot.loadBot(null, 'shell', true, 'echobot', null)
  this.botkitBot = new HubotBot(this.hubot, config);
  this.middleware = new Middleware(this.botkitBot.storage, this.botkitBot.middleware)
}

Bot.prototype.on = function(event, callback) {
  this.botkitBot.on(event, this.createHandler(callback))
}

Bot.prototype.hears = function(patterns, eventFilter, middleware_or_callback, callback) {

  if (callback) {
      this.botkitBot.hears(patterns, eventFilter, middleware_or_callback, this.createHandler(callback))
  } else {
      this.botkitBot.hears(patterns, eventFilter, this.createHandler(middleware_or_callback))
  }
}

Bot.prototype.use = function(component) {
  component(this)
}

Bot.prototype.spawn = function(config) {
  this.botkitBot.spawn(config)
}

Bot.prototype.changeEars = function(ears) {
  this.botkitBot.changeEars(ears)
}

Bot.prototype.createHandler = function(callback) {

  var botkitBot = this.botkitBot

  return function(bot, subject) {

    var context = new Context(botkitBot.storage, subject)

    context.fetch().then(function() {
      var appliedBot = applySubjectToBot(bot, subject)
      callback(appliedBot, subject, context)
      context.save()
    }).catch(function(err){
      console.error(err)
    })
  }
}

module.exports = {
  Bot: Bot
}
