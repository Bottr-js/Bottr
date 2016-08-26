var Express = require('express');
var BodyParser = require('body-parser');
var ResponseMiddleware = require('./response-middleware');
var EventEmitter = require('./event-emitter');
var StringMatcher = require('./string-matcher');
var RegExpMatcher = require('./regexp-matcher');
var ArrayMatcher = require('./array-matcher');
var FacebookMessengerClient = require('./facebook-messenger-client');
var WebhookClient = require('./webhook-client');
var MemoryStorage = require('./memory-storage');

function Bot() {

  this.router = Express.Router()
  this.eventEmitter = new EventEmitter()

  this.router.use(BodyParser.json())
  this.router.use(new ResponseMiddleware())
  this.router.get('/', this.handleWebUIRequest.bind(this))
  this.router.get('/webhook', this.handleWebhookRequest.bind(this))
  this.router.post('/webhook', this.handleWebhookRequest.bind(this))
}

Bot.prototype.handleWebUIRequest = function(req, res) {
  res.send('Web UI');
}

Bot.prototype.handleWebhookRequest = function(req, res) {
  this.trigger('webhook', req, res);
}

Bot.prototype.trigger = function(eventName) {
  console.log(eventName +' event triggered')
  this.eventEmitter.emit.apply(this.eventEmitter, arguments)
}

Bot.prototype.on = function(eventName, handler) {
  this.eventEmitter.addListener(eventName, handler)
}

Bot.prototype.hears = function(pattern, handler) {

  var matcher = pattern

  if (pattern instanceof Array) {
    matcher = new ArrayMatcher()
  } else if (pattern instanceof String) {
    matcher = new StringMatcher(pattern)
  } else if(pattern instanceof RegExp) {
    matcher = new RegExpMatcher(pattern)
  }

  this.on('message_received', function(message, session, next) {
    if (matcher(message)) {
      handler(message, session)
    } else {
      next()
    }
  })
}

Bot.prototype.use = function(component) {
  component(this)
}

function startBot(bot, port) {
  console.log("Bot is listening to port " + port)
  var server = Express()
  server.use(bot.router)
  server.listen(port)
}

module.exports = {
  Bot: Bot,
  WebhookClient: WebhookClient,
  FacebookMessengerClient: FacebookMessengerClient,
  MemoryStorage: MemoryStorage,
  startBot: startBot
}
