---
title: "Bottr: Api.ai"
---
# Api.ai

This component allows your bot to forward it's messages to the Api.ai service for processing. IT will automatically send any messages as well as trigger events you specify in your intents from the service.

## Installation

Install the `Bottr-Apiai`  NPM package:

`$ npm install --save bottr-apiai`

## Basic Usage

```javascript
import Bottr from 'bottr'
import Apiai from 'bottr-apiai'

var bot = new Bottr.Bot()

bot.use(new Apiai('your_apiai_token'))

bot.listen()
```
