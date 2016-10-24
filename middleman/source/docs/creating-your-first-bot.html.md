---
title: "Bottr: Creating Your First Bot"
---
# Creating Your First Bot

For this guide we will be building a simple bot that repeats what the user sends to it. Before we begin you will need to use the ["Creating A New Project" Guide](Creating-a-new-project), to create a new `EchoBot` project.

## Hello World

Currently our code in our `index.js` looks something like this:


```javascript
const Bottr = require('bottr')
const BottrApp = require('bottr-app')

const bot = new Bottr.Bot()
bot.use(new BottrApp())
bot.listen()
```

In order to get our bot to respond to our messages we need to describe what it should do. In this example we will get it to reply with 'Hello World' for each message the user sends.

On the first line we listen out for a `message_received` event triggered when we receive a message and then on the second line we tell the bot to reply with a message.

This code should go before the call to `listen`

```javascript
bot.on('message_received', function(message, session) {
  session.send('Hello World')
})
```

## Testing it out

If you followed this guide correctly your `index.js` should now look like this:

```javascript
const Bottr = require('bottr');
const bot = new Bottr.Bot();

bot.on('message_received', function(message, session) {
  session.send('Hello World')
})

bot.listen();
```

If you now run `bottr start`, open `localhost:3000` in your browser and send the bot a message it should reply with "Hello World".

Next: [Deploying Your Bot](Deploying-Your-Bot)
