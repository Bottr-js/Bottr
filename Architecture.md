## Architecture

There are three main principles driving the design of Pozi:

- Stateless - Due to the nature of Bot building each message triggers a new request, therefore we need to build the bot in a stateless manner.
- Flexible - The framework must have ability to easily plug into multiple services with minimal modification and work from the developer. In addition the bot should be composable and gain additional functionality via the use of components.
- Minimal - Implementing a bot using this framework should be like writing any other web application. We build on the concept of convention of configuration to meet this goal.

This contrasts to Hubot which is genrally hardcoded to one team configuration and
Botkit which is minimal but mainly configuration based.

## Clients

We support 2 direct ways of interfacing with the bot:

- Web Hooks
- Web Sockets

On top of this we have focused on integrating with B2C communication channels, starting with:

- SMS (via Twilio)
- Twitter
- Facebook Messenger
- Web UI

In the future we would like to add other clients such as Line or team based services such as Slack but these aren't a priority right now but we are open to people writing their own clients for use with Pozi.

## Events

Pozi is an event driven framework which allows it to respond quickly to messages. Each event handler does one thing and does it well.

This means that essentially each bot is a collection of events and event handlers.

When an event is triggered, the bot goes through its list of event handlers and triggers them from the earliest definition to latest. This allows the user to control which order these statements are triggered to give the `/stats` handler a higher priority since it was declared first:

```
bot.hears(/\stats/, ...)
bot.hears(/.+/, ...)
```

In other frameworks such as Wordpress, you often have hooks and filters for events but in Pozi we have combined both. This allows handlers to inject additional information to an event, handle it or bail and defer to something else.

### Filters

Filtering allows a handler to inject additional information about an event into the
event itself or the context. This is useful for things such as natural language processing.

There is an example in our EchoBot tutorial where we use a filter to calculate the statistics
for the all the messages has sent to the bot.

Filters always call the `next` callback to signify to the bot that the event should carry down
the event chain to the next event handler.

```

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

### Hooks

Hooking is where a handler breaks the event chain to handle an event, clients use this when responding to a `webhook` event so it can be handled and to stop it propogating to unrelated clients.

Hooks aren't guaranteed to call the `next` callback depending on if they want to handle it or not.

### Defering

There are situations where a hook may not want to handle an event this is known as "deferring", the most
common case of this is for the bot's `hears` method.

Internally the bot creates a hook on the `message_received` event which will handle the event
if the message matches the pattern passed into the method or defer to another handler if not.

Eventually if the Bot reaches the end of event chain without anything handling it then the bot allows
unhandled events to be handled by a special handler called an `unhandler`.
There are built in unhandlers for the `webhook` and `message_received` event which send an error response or a message to the user ("Sorry my creator didn't teach me anything else") respectively.

If there isn't an unhandler it will log an error. Unhandlers are typically used for critical events
that may degrade the experience of using a bot if not implemented correctly.

## Matchers

The bot's `hears` method uses a matcher method to figure out if it should handle that message or not. The first parameter accepts a method that returns true if it should be handled or false if not.

```
bot.hears(function(message){
  return true
}, ...)
```

The definition above would handle all messages given to it since the matcher function returns true. Pozi
also implements some built in matchers for strings, regexs, arrays of string and arrays of regexs.

Internally when any of these are passed into the first parameter Pozi subsitutes them for a function
which matches them against the contents of the message, so we can now do any of these:

```
bot.hears('match me', ...)
bot.hears(['match me', 'equal'], ...)
bot.hears(/match me/, ...)
bot.hears([/match me/, /equal/], ...)
```

## Context

The context is an object the stores information the bot can use to make decisions,
this can contain statistics or track what is happening in the conversation
(i.e the user is ordering a pizza).

Contexts are usually provided by storages which are pulled in as a component, storage
components extend the session object with methods to fetch contexts for the user, conversation and team (for team based channels).

## Components

Components are a simple way of extending a bot with additional functionality, the `use`
method takes a simple function which accepts a bot to extend.

```
bot.use(function(bot) { ... })
```

Typically this is used to add support for extra services ("Clients"), context storage options ("storage")
or custom functionality like natural language processing or canned responses
(Such as the bot responding to expressions of gratitude).
