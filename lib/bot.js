const BodyParser = require('body-parser');
const EventEmitter = require('./event-emitter');
const Express = require('express');
const ResponseMiddleware = require('./response-middleware');
const fs = require('fs');
const request = require('request');
const uuid = require('uuid');
const cors = require('cors');
const Topic = require('./topic');

const staticFilesDirectory = 'public';

class Bot {

    constructor(name) {
        this.name = name || 'bot';
        this.memory = {
          users: {

          },
        };

        this.topics = {};

        this.router = Express.Router();
        this.eventEmitter = new EventEmitter();
        this.rootTopic = new Topic();

        this.eventEmitter.addListener('message_received', (message, session) => {
          const context = session.getUserContext();
          let topic = this.rootTopic;

          if (context.currentTopic !== undefined) {
            topic = this.topics[context.currentTopic];
          }

          topic.trigger('message_received', message, session);
        });

        this.eventEmitter.fallback('webhook', (req, res) => {
          res.error('No webhook handlers configured');
        });

        this.router.use(`/${staticFilesDirectory}`, Express.static('public'));
        this.router.use(cors());
        this.router.use(BodyParser.json());
        this.router.use(BodyParser.urlencoded());
        this.router.use(new ResponseMiddleware());

        this.router.get('/webhook', this.handleWebhookRequest.bind(this));
        this.router.post('/webhook', this.handleWebhookRequest.bind(this));

        this.eventEmitter.fallback('event', function(req, res) {
            res.error('No event handlers configured')
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

    handleEventRequest(req, res) {
      this.trigger('event', req, res)
    }

    handleWebhookRequest(req, res) {
      this.trigger('webhook', req, res)
    }

    trigger(eventName, ...args) {
        console.log(`${eventName} event triggered`);
        this.eventEmitter.emit(eventName, ...args);
    }

    // - Default to Topic -> RootTopic - Update code not to need this hack
    on(eventName, handler) {
        if (eventName === 'message_received') {
          this.rootTopic.on(eventName, handler);
        } else {
          this.eventEmitter.addListener(eventName, handler);
        }
    }

    hears(pattern, handler) {
        this.rootTopic.hears(pattern, handler);
    }

    use(component) {
        component(this);
    }

    download(attachment, callback) {
        if (attachment.url) {
          this.downloadFileFromUrl(attachment.url, callback);
        } else {
          this.downloadFileFromData(attachment.data, callback);
        }
    }

    downloadFileFromUrl(url, callback) {
        const filename = uuid.v4();

        if (!fs.existsSync(staticFilesDirectory)) {
          fs.mkdirSync(staticFilesDirectory);
        }

        const r = request(url);
        const s = fs.createWriteStream(`${staticFilesDirectory}/${filename}`);

        r.on('response', (res) => {
          res.pipe(s);
        });

        s.on('close', () => {
          callback(`${staticFilesDirectory}/${filename}`);
        });
    }

    downloadFileFromData(data, callback) {
        const filename = uuid.v4();
        const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const buffer = new Buffer(matches[2], 'base64');

        if (!fs.existsSync(staticFilesDirectory)) {
          fs.mkdirSync(staticFilesDirectory);
        }

        fs.writeFile(`${staticFilesDirectory}/${filename}`, buffer, 'base64');

        callback(`${staticFilesDirectory}/${filename}`);
    }

    createTopic(callback) {
        const topicID = Object.keys(this.topics).length;
        this.topics[topicID] = new Topic();

        callback(this.topics[topicID]);

        return topicID;
    }
}

module.exports = Bot;
