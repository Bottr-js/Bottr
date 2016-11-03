---
title: "Bottr: Facebook Client"
---
# Facebook Messenger Client

The Facebook Messenger Client allows your bot to communicate via Facebook Messenger.

## Basic Usage

```javascript
import Bottr from 'bottr'

var bot = new Bottr.Bot()

bot.use(new Bottr.TwitterClient({
    verify_token: 'verify_me',
    access_token: 'your_facebook_messenger_application_access_token'
}))

bot.listen()
```

## Configuration

You can pass these options to the client either by environmental variables or by
an object passed in though the constructor.

| Configuration Name | Environmental Variable | Description                                                                             | Default                     |
|--------------------|------------------------|-----------------------------------------------------------------------------------------|-----------------------------|
| verify_token       | `MESSENGER_VERIFY_TOKEN` | The verification token used by Facebook Messenger to verify your server and webhook     |                             |
| access_token       | `MESSENGER_ACCESS_TOKEN ``| The access token used to authenticate your Bot with your Facebook Messenger application |                             |
| graph_uri          |                        | The default URI for the graph API                                                       | `https://graph.facebook.com` |
