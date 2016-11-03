---
title: "Bottr: Twitter Client"
---
# Twitter Client

The Twitter Client allows your bot to communicate via Tweets on Twitter. The client will respond to tweets which mention the bot's name (i.e `@bottymcbotface`).

## Basic Usage

```javascript
import Bottr from 'bottr'

var bot = new Bottr.Bot({
    name: 'BottyMcBotFace' // Set the name for the bot, this determines the bot's name on twitter
})

bot.use(new Bottr.TwitterClient({
    consumer_key: 'your_twitter_app_consumer_key',
    consumer_secret: 'your_twitter_app_consumer_secret',
    access_token: 'your_twitter_app_access_token',
    access_token_secret: 'your_twitter_app_access_token_secret',
}))

bot.listen()
```

## Configuration

You can pass these options to the client either by environmental variables or by
an object passed in though the constructor.

| Configuration Name  | Environmental Variable      | Description                                                                  | Default |
|---------------------|-----------------------------|------------------------------------------------------------------------------|---------|
| consumer_key        | `TWITTER_CONSUMER_KEY`        | The  consumer key used to authenticate your Bot with a Twitter Application   |         |
| consumer_secret     | `TWITTER_CONSUMER_SECRET`     | The consumer secret used to authenticate your Bot with a Twitter Application |         |
| access_token        | `TWITTER_ACCESS_TOKEN`        | The access token to authenticate your Bot with a Twitter Account             |         |
| access_token_secret | `TWITTER_ACCESS_TOKEN_SECRET` | The access token secret used to authenticate your Bot with a Twitter Account |         |
