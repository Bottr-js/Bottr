---
title: "Bottr: WebSocket Client"
---
# WebSocket Client

The WebSocket Client allows your bot to be communicate over WebSockets, this is
useful for those wanting to build their own frontends.

Bottr-App uses this client in order to communicate with your Bot.

## Basic Usage

This client is automatically used by default when using the  `listen` method for your bot.

```javascript
import Bottr from 'bottr'

var bot = new Bottr.Bot()
bot.listen()
```

## Configuration

There aren't any configuration options for this client, it just works out of the box!
