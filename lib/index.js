var HubotBot = require('./hubot-bot');
var Context = require('./context');
var Middleware = require('./middleware');
var applySubjectToBot = require('./apply-subject-to-bot');
var express = require('express');

function Bot2() {

  this.server = express()

  this.server.get('/', this.handleWebUIRequest.bind(this));
  this.server.get('/webhook', this.handleWebhookRequest.bind(this));
  // - Websocket as another source for web UI
}

Bot2.prototype.handleWebUIRequest = function(req, res) {
  res.send('Web UI');
}

Bot2.prototype.handleWebhookRequest = function(req, res) {
  this.trigger('webhook');
  res.send({});
}

Bot2.prototype.trigger = function(event) {
  console.log(event +' event triggered')
}

Bot2.prototype.listen = function(port) {
  console.log("Bot is listening to port " + port)
  this.server.listen(port);
}

function Bot(config) {
  //adapterPath, adapterName, enableHttpd, botName, botAlias
  this.botkitBot = new HubotBot(config);
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
  Bot: Bot,
  Bot2: Bot2
}
