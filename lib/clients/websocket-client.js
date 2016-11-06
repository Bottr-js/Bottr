const Session = require('../session');
const BaseClient = require('./base-client');

class WebsocketClient extends BaseClient {
  init() {
    const io = this.config;
    this.sockets = {};
    this.bot.on('event', this.createEventHandler());
    io.on('connection', this.createConnectionHandler());
  }

  createEventHandler() {
    return (req, res, next) => {
      // If this isn't a websocket request then carry on with other handlers
      if (!{}.hasOwnProperty.call(req.query, 'websocket')) {
        next();
        return;
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
    };
  }

  createConnectionHandler() {
    return (socket) => {
      const socketID = Object.keys(this.sockets).length;

      console.log(`new websocket connection ${socketID}`);
      socket.on('message', this.createMessageHandler(socket));

      this.sockets[socketID] = socket;
    };
  }

  createMessageHandler(socket) {
    return (data) => {
      const session = new Session(this.bot, data.user, this);
      session.socket = socket;

      this.bot.trigger('message_received', data, session);

      return session;
    };
  }

  send(session, text, attachment) {
    const message = {};

    if (text) {
      message.text = text;
    }

    if (attachment) {
      message.attachment = {
        type: attachment.type,
        url: attachment.url,
      };
    }

    session.socket.emit('message', message);
  }

  startTyping(session) {
    session.socket.emit('typing', {});
  }
}

module.exports = WebsocketClient;
