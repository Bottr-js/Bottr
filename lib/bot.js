
var BodyParser = require('body-parser')
var EventEmitter = require('./event-emitter')
var Express = require('express')
var Matchers = require('./matchers')
var ResponseMiddleware = require('./response-middleware')

function Bot() {
  this.router = Express.Router()
  this.eventEmitter = new EventEmitter()

  this.router.use(BodyParser.json())
  this.router.use(new ResponseMiddleware())
  this.router.get('/webhook', this.handleWebhookRequest.bind(this))
  this.router.post('/webhook', this.handleWebhookRequest.bind(this))
}

Bot.prototype.handleWebhookRequest = function(req, res) {
  this.trigger('webhook', req, res);
  // - Close when no handlers
  // - Close when nothing handled it
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
    matcher = new Matchers.ArrayMatcher(pattern)
  } else if (pattern instanceof String) {
    matcher = new Matchers.StringMatcher(pattern)
  } else if(pattern instanceof RegExp) {
    matcher = new Matchers.RegExpMatcher(pattern)
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

Bot.prototype.connectToSocket = function(io) {

  var bot = this

  io.on('connection',  function (socket) {

    console.log('new websocket connection')

    socket.on('message', function(data) {

      var session = {
        user: data.user,
        conversation: data.user,
        account: data.user,
        send: function(text) {

          socket.emit('message', {
            text: text
          })
        }
      }

      bot.trigger('message_received', data, session)
    })
  });
}

module.exports = Bot
