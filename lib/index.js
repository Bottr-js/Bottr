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

  this.server = Express()
  this.eventEmitter = new EventEmitter()

  this.server.use(BodyParser.json())
  this.server.use(new ResponseMiddleware())
  this.server.get('/', this.handleWebUIRequest.bind(this))
  this.server.get('/webhook', this.handleWebhookRequest.bind(this))
  this.server.post('/webhook', this.handleWebhookRequest.bind(this))
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

Bot.prototype.listen = function(port) {
  console.log("Bot is listening to port " + port)
  this.server.listen(port);
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

module.exports = {
  Bot: Bot,
  WebhookClient: WebhookClient,
  FacebookMessengerClient: FacebookMessengerClient,
  MemoryStorage: MemoryStorage
}
