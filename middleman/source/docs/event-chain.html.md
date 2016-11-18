---
title: "Bottr: Event Chain"
---
# Event Chain

At it's core Bottr is an event based framework, every message or action received from a
user is translated into an event which is processed by the event chain.

## Triggering An Event

Triggering an event should be familiar to most well versed in javascript, your Bot
exposes a `trigger` method which will trigger the event on the event chain passing
down any additional arguments you give to it.

```javascript
bot.trigger('event_name', ...arguments)
```

## Handling or Filtering An Event

Your bot exposes an `on` event which will create new listener which will call your function
when that event is triggred.

```javascript
bot.on('event_name', (...arguments, next) {
 // Your event code here
})
```

Listeners are called in the chronological order they are declared in the codebase
in a concept called the Event Chain.

### Filtering

Filtering an event allows you to add additional information to an event's arguments
and choose to call the next event listener in the event chain

As well as the arguments passed to the `trigger` method, the event listener is
passed a special function named the `next` function which when called causes
the event chain to proprogate to the next listener.

```javascript
bot.on('message_received', (message, session, next) {

 // Add some other information to the message
 message.is_attachment = message.hasOwnProperty("is_attachment")

 if (message.is_attachment) {
     next() // Only allow this to propogate to other listners if the message isn't an attachment
 }
})
```

Under the hood `hears` method uses filtering to allow a message to propergate if it doesn't
have a match in the array of patterns given.

### Handling

Handling is simply an event handler which never calls the next function, causing
the event chain to stop.

```javascript
bot.on('message_received', (message, session) {
    // Handle Message
})
```

## Fallbacks

If all of the listeners in the event chain call the next function then the event chain
will reach the fallback, that if provided will execute. In the Bottr framework we
use this to send a default message when a new message isn't handled.

You can see this implementation here.

```javascript
bot.fallback('message_received', (message, session) {
    session.send("Sorry I don't know how to do that :(")
})
```

## Built In Events

Bottr has some built in events already:

- message_received
- webhook
