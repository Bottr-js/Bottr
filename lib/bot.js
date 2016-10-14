var BodyParser = require('body-parser')
var EventEmitter = require('./event-emitter')
var Express = require('express')
var ResponseMiddleware = require('./response-middleware')
var fs = require('fs')
var request = require('request')
var uuid = require('node-uuid')
var cors = require('cors')
var Topic = require('./topic')

var staticFilesDirectory = 'public'

function Bot(name) {
  this.name = name || 'bot'
  this.memory = {
    users: {

    }
  }

  this.topics = {}

  this.router = Express.Router()
  this.eventEmitter = new EventEmitter()
  this.rootTopic = new Topic()

  this.eventEmitter.addListener('message_received', function(message, session) {

    var context = session.getUserContext()
    var topic = this.rootTopic

    if (context.currentTopic != undefined) {
      topic = this.topics[context.currentTopic]
    }

    topic.trigger('message_received', message, session)

  }.bind(this))

  this.eventEmitter.fallback('webhook', function(req, res) {
    res.error('No webhook handlers configured')
  }.bind(this))

  this.router.use('/' + staticFilesDirectory, Express.static('public'))
  this.router.use(cors())
  this.router.use(BodyParser.json())
  this.router.use(BodyParser.urlencoded())
  this.router.use(new ResponseMiddleware())

  this.router.get('/webhook', this.handleWebhookRequest.bind(this))
  this.router.post('/webhook', this.handleWebhookRequest.bind(this))
  this.router.post('/event', this.handleEventRequest.bind(this))
}

Bot.prototype.handleEventRequest = function(req, res) {
  this.trigger('event', req, res)
}

Bot.prototype.handleWebhookRequest = function(req, res) {
  this.trigger('webhook', req, res)
}

Bot.prototype.trigger = function(eventName) {
  console.log(eventName +' event triggered')
  this.eventEmitter.emit.apply(this.eventEmitter, arguments)
}

// - Default to Topic -> RootTopic - Update code not to need this hack
Bot.prototype.on = function(eventName, handler) {
  if (eventName == 'message_received') {
    this.rootTopic.on(eventName, handler)
  } else {
    this.eventEmitter.addListener(eventName, handler)
  }
}

Bot.prototype.hears = function(pattern, handler) {
  this.rootTopic.hears(pattern, handler)
}

Bot.prototype.use = function(component) {
  component(this)
}

Bot.prototype.download = function(attachment, callback) {
  if (attachment.url) {
    this.downloadFileFromUrl(attachment.url, callback)
  } else {
    this.downloadFileFromData(attachment.data, callback)
  }
}

Bot.prototype.downloadFileFromUrl = function(url, callback) {

  var filename = uuid.v4()

  if (!fs.existsSync(staticFilesDirectory)){
    fs.mkdirSync(staticFilesDirectory)
  }

  var r = request(url)
  var s = fs.createWriteStream(staticFilesDirectory + '/' + filename)

  r.on('response',  function (res) {
    res.pipe(s)
  })

  s.on('close', function() {
    callback(staticFilesDirectory + '/' + filename)
  })
}

Bot.prototype.downloadFileFromData = function(data, callback) {

  var filename = uuid.v4()
  var matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  var buffer = new Buffer(matches[2], 'base64')

  if (!fs.existsSync(staticFilesDirectory)){
    fs.mkdirSync(staticFilesDirectory)
  }

  fs.writeFile(staticFilesDirectory + '/' + filename, buffer, 'base64')

  callback(staticFilesDirectory + '/' + filename)
}

Bot.prototype.createTopic = function(callback) {

  var topicID = Object.keys(this.topics).length
  this.topics[topicID] = new Topic()

  callback(this.topics[topicID])

  return topicID
}

module.exports = Bot
