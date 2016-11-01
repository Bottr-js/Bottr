---
title: "Bottr: Adding Functionality"
---
# Adding Functionality

This guide assumes you have read the ["Deploying Your Bot" Guide](/docs/Deploying-Your-Bot).

We are going to be adding our first piece of real functionality to our bot. We will tweak the bot to repeat what the user sends to it and then we will allow the user to ask the bot to send it statics about the number of words and messages the user sent.

## Adding An Action

Right now our bot is configured to send something anytime it receives a `received_message` event. We're going to change this so that we use the `hears` method to process the message itself instead.

The `hears` method allows us to specify patterns and events for the bot to listen out for.

We will define two listeners one that will listen out for when the user sends the phrase '/stats' and another which will listen out to any message the user sends.

```javascript

bot.hears(/\/stats/, function(message, session) {

 var context = session.getUserContext()

 // Send the total number of messages to the
 // user
 session.send("Total Message Count: " + context.messageCount)

 // Send the total number of words to the
 // user
 session.send("Total Word Count: " + context.wordCount)
});

bot.hears([/.+/], function(message, session) {
  // Repeat what the user sent us
  session.send(message.text)
});
```

The bot will trigger actions declared earlier first. For our bot we have declared the '/stats' action first since the second listener would just echo out '/stats' and prevent our statistics code from executing.

As you can see when the user sends "/stats", our bot will now print out the stats and when the user sends a norma message the Bot will repeat it.

The code above takes advantage of a storage component to allow our bot keep track of the stats for our messages and to print them out.

Right now our bot triggers an error because we haven't setup a storage component for our bot.

### Components

Components are packages that add additional functionality to your bot; Clients are one type of component and Storages are another. These can also do things such as add additional data to the message such as natural language classification or implemented canned responses for your bot (Such as replying to expressions of gratitude).

We are going to configure out Bot to use the Memory Storage component, this allows out bot to store and retrieve information to a in-memory context. This context will contain data per-user, per-conversation or per-team which our bot will use when deciding what actions to perform.

This code goes next to our code for the Facebook Messenger client:

```javascript
bot.use(new Bottr.MemoryStorage())
```

Now if we run our bot, we no longer have an error but it now sends us "undefined" where our statistics should be. This is because we haven't yet implemented the code to calculate them and store them in the context.

## Implementing the statistics

Because this needs to happen before our bot handles the message we will put it before both of our `hears` declarations.

```javascript
bot.on('message_received', function(message, session, next) {

 // Get existing context or use defaults if values don't exist
 var context = session.getUserContext({
   messageCount: 0,
   wordCount: 0,
 })

 // Calculate new statistics
 context.messageCount ++
 var words = message.text.split(" ")
 context.wordCount += words.length

 //Store new values into context
 session.updateUserContext(context)

 //Tell bot to let other handlers process the message
 next()
});
```

The snippet above is pretty long so lets start breaking it down:

```javascript
bot.on('message_received', function(message, session, next) {
```

Like in our first version of the bot we listen to any message we receive from the user.

```javascript
var context = session.getUserContext({
   messageCount: 0,
   wordCount: 0,
})
```

On the first line of our handler we ask the session for the context for the current user and we provide some default values to use if they don't exist

```javascript
 // Calculate new statistics
 context.messageCount ++
 var words = message.text.split(" ")
 context.wordCount += words.length
```

We calculate the new total number of messages and words the user sent.

```javascript
 //Store new values into context
 session.updateUserContext(context)
```

We store the new statistics into the context so they can be accessed when the bot sends them to the user.

```javascript
next()
```

Finally we call the `next` callback to let the bot to carry on processing this message, the bot should then carry on and trigger one of our `hears` methods.

## Testing It Out

Now if you send `/stats` to the bot it should tell you how many messages and words you have sent it.
