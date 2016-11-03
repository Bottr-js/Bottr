---
title: "Bottr: Bottr App"
---
# Bottr App

This component serves a web chat interface which can be used to talk to your bot over the WebScoket Client.
When using `bottr init` we setup a bot which uses this by default.

To use this interface just visit the URL for your Bot and you should see it.

## Installation

Install the `Bottr-App`  NPM package:

`$ npm install --save bottr-app`

## Basic Usage

```javascript
import Bottr from 'bottr'
import BottrApp from 'bottr-app'

var bot = new Bottr.Bot()

bot.use(new Bottr.BottrApp())

bot.listen()
```
