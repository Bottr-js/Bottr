var Express = require('express')

const VALIDATION_TOKEN = 'testing';

function FacebookMessengerClient() {}

FacebookMessengerClient.prototype.start = function(bot) {

  var app = Express()

  app.get('/', function (req, res) {
    res.send('BotKit is running.')
  })

  app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  });

  app.listen((process.env.PORT) ? process.env.PORT : 3000)
};

FacebookMessengerClient.prototype.speak = function(message) {
  console.log(message);
}

module.exports = FacebookMessengerClient;
