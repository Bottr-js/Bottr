
var BodyParser = require('body-parser')
var EventEmitter = require('./event-emitter')
var Express = require('express')
var Matchers = require('./matchers')
var ResponseMiddleware = require('./response-middleware')
var fs = require('fs');
var request = require('request');
var uuid = require('node-uuid');

function Bot(name) {
  this.name = name || 'bot'

  this.router = Express.Router()
  this.eventEmitter = new EventEmitter()

  this.eventEmitter.addListener('message_received', function(message, session, next) {
    session.startTyping()
    next()
  })

  this.eventEmitter.onUnhandled('webhook', function(req, res) {
    res.error('No webhook handlers configured')
  })

  this.eventEmitter.onUnhandled('message_received', function(message, session) {
    session.send("Sorry my creator didn't teach me anything else")
  })

  this.router.use(Express.static('public'));
  this.router.use(BodyParser.json())
  this.router.use(BodyParser.urlencoded())
  this.router.use(new ResponseMiddleware())

  this.router.get('/webhook', this.handleWebhookRequest.bind(this))
  this.router.post('/webhook', this.handleWebhookRequest.bind(this))
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

var download = function(uri, filename, callback){

};

Bot.prototype.download = function(attachment, callback) {

  if (attachment.url) {
    this.downloadFileFromUrl(attachment.url, callback)
  } else {
    this.downloadFileFromData(attachment.data, callback)
  }
}

Bot.prototype.downloadFileFromUrl = function(url, callback) {

  // request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
  // Get data and pass to download file
}

Bot.prototype.downloadFileFromData = function(data, callback) {

  var filename = uuid.v4()
  var directory = 'public'

  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
  }

  fs.writeFile(directory + "/" + filename, data)

  callback("HOST/" + directory + "/" + filename)
}

module.exports = Bot
