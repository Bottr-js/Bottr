var Session = require('../session')

function WebsocketClient(io) {
  return function(bot) {
    this.bot = bot
    this.sockets = {}

    this.bot.on('event', this.createEventHandler())
    io.on('connection', this.createConnectionHandler())

    return this
  }.bind(this)
}

WebsocketClient.prototype.createEventHandler = function() {
  return function(req, res, next) {

    // If this isn't a websocket request then carry on with other handlers
    if ( !req.query.hasOwnProperty('websocket') ) {
      next()
      return
    }

    // TODO: Implement for Websockets

    // console.log(req.body)

    // var socket = this.sockets[req.body.data.user]
    // var session = new Session(this.bot, {}, this)
    //
    // session.socket = socket
    // session.send('Event')
    //
    // res.success()

  }.bind(this)
}

WebsocketClient.prototype.createConnectionHandler = function() {
  return function(socket) {

    var socketID = Object.keys(this.sockets).length

    console.log('new websocket connection ' + socketID)
    socket.on('message', this.createMessageHandler(socket))

    this.sockets[socketID] = socket

  }.bind(this)
}

WebsocketClient.prototype.createMessageHandler = function(socket) {
  return function(data) {

    var session = new Session(this.bot, data.user, this)
    session.socket = socket

    this.bot.trigger('message_received', data, session)

    return session

  }.bind(this)
}

WebsocketClient.prototype.send = function(session, text, attachment) {

  var message = {}

  if (text) {
    message.text = text
  }

  if (attachment) {
    message.attachment = {
      type: attachment.type,
      url: attachment.url
    }
  }

  session.socket.emit('message', message)
}

WebsocketClient.prototype.startTyping = function(session) {
  session.socket.emit('typing', {})
}

module.exports = WebsocketClient
