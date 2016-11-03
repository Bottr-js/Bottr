---
title: "Bottr: Facebook Client"
---
# Facebook Messenger Client

This component allows your bot to use the Facebook Messenger Client to allow your bot to
communicate with Facebook Messenger.

## Basic Usage

```javascript
import Bottr from 'bottr'

var bot = new Bottr.Bot()

bot.use(new Bottr.FacebookMessengerClient())

bot.listen()
```

## Configuration

Table of configuration options here and blurb on webhook URL
