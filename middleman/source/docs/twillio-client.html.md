---
title: "Bottr: Twillio Client"
---
# Twillio Client

The Twillio Client to allow your bot to communicate via SMS with Twillio.

## Basic Usage

```javascript
import Bottr from 'bottr'

var bot = new Bottr.Bot()

bot.use(new Bottr.TwillioClient({
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    phone_number: process.env.TWILIO_PHONE_NUMBER
}))

bot.listen()
```

## Configuration

You can pass these options to the client either by environmental variables or by
an object passed in though the constructor.

| Configuration Name | Environmental Variable | Description                                                                     | Default |
|--------------------|------------------------|---------------------------------------------------------------------------------|---------|
| account_sid        | TWILIO_ACCOUNT_SID     | The Account SID for the Twilio Account your bot should use                      |         |
| auth_token         | TWILIO_AUTH_TOKEN      | The authentication token used to authenticate your bot with your Twilio Account |         |
| phone_number       | TWILIO_PHONE_NUMBER    | The Twilio Phone Number your bot will use                                       |         |
