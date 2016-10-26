---
title: "Bottr: Deploying Your First Bot"
---
# Deploying Your First Bot

This guide assumes you have read the ["Creating Your First Bot" Guide](Creating-Your-First-Bot).

So we have a Bot that we can talk to and it can respond to us via the command line but this isn't really helpful for the real-world. Right now the user can only use this if this was installed on their local machine.

So lets fix this by connecting it up to a third-party service any user can use to communicate with the Bot without having to install anything. We will be updating the code for our Bot to support communication from Facebook Messenger and deploying this code on Heroku.

## Deploying to Heroku

Before we can start connecting our Bot to Facebook we need to make sure it is avaliable online. The easiest way to do this is via Heroku who make it simple to deploy a Bottr Bot and provide a free tier.

Visit https://www.heroku.com/, create an account and then create a new app. Once you have given your app a name you should be presented with a screen with instructions on how to upload your Bot.

![](/images/heroku.png)

### Install the Heroku Toolbelt

We need to follow the instructions for deploying using Heroku Git, to do this you need to install the [Heroku Toolkit](https://toolbelt.heroku.com/).

Then log in to your Heroku account and follow the instructions to create a new SSH Public Key.

```
$ heroku login
```

### Create a new Git repository

Initialize a git repository for your Bot.

```
$ git init
$ heroku git:remote -a <YourHerokuAppName>
```

### Deploy your Bot

Create a `Procfile` with the following content; This tells Heroku what command to invoke to start your Bot.

```
web: node .
```

Commit your code to the repository and deploy it to Heroku using Git.

```
$ git add .
$ git commit -am "the humans are dead"
$ git push heroku master
```

Heroku will then take your Bot, detect that is a Bottr project and setup the environment. It will give you a URL from where your Bot will be accessible but we still have a little more work to do before we will see anything.

## Creating our Facebook Messenger Application

### Create a Facebook Page

The first thing we need to do is create the Facebook Page the User will use to contact our bot, you can do this [here](https://www.facebook.com/pages/create/).

Skip the steps for uploading a profile picture and filling in the details of the page as you can do that later if needed.

### Create a Facebook Application

The next step is to setup a Facebook Messenger Application which will connect the Page with our Bot.

First create a new Web application [here](https://developers.facebook.com/quickstarts/?platform=web)

![](/images/new-facebook-app.png)

You should then be taken to a "Quick Start for Website" page, at the bottom they will ask you for the URL for your Bot. Enter the one given to you from Heroku when you deployed your Bot.

Once this is done you can then click the skip button at the top of the page which will take you to your newly created Application.

## Hooking up your Bot

### Updating the client

To implement Facebook for our bot we need to tell our bot to start using the Messenger client like so:

```javascript
bot.use(new Bottr.FacebookMessengerClient())
```

The Messenger client reads the tokens from the environmental variables, so lets add these so we can start talking to our bot via Facebook.

### Add The Messenger Product

Click "Add Product" on the left of the screen and then click the "Get Started" button next to the Messenger option which will be displayed.

Click "Get Started" again and we will be presented with a list of options to configure.

#### Page Access Token

For the Token Generation section of the page, select your Facebook Page, Authenticate and then copy the Page Access Token that is displayed. You will need to set the environmental variable on heroku.

Just run this in your command line.

```
heroku config:set MESSENGER_ACCESS_TOKEN="<YourPageToken>"
```

#### Web Hooks

We now need to configure the web hooks for your bot which Facebook will call when a user performs an action with the chat for your Facebook Page.

First lets create a Validation Secret, this will be a string Facebook will use to verify its talking to your bot when creating the hooks.

```
heroku config:set MESSENGER_VERIFY_TOKEN="<CreateYourOwnSecret>"
```

In the Webhooks section click "Setup Webhooks", for the callback URL you need to enter "<YourBotURL>/webhook" and for the verify token enter in your validation secret you added to your bot.

Check the `message_deliveries`, `messaging_optins`, `messaging_postbacks` and `messages` options. Before you click save you will need to deploy your Bot once more to Heroku so that it is updated with the new Client and Tokens.

Visit the URL for your bot, if you see a chat interface for your bot then it is working. Go back to Facebook and now click save; if all is working then your Webhooks will be created.

## Testing it out

To test it out simply go back to your Facebook Page, Click the configure a button option and add a new "Send Message" Button. Then hover over it and click the "Test Button" option.

This should open a new chat with our Bot (The status of the page should be Online), if we send a message the Bot will send us the same message back to us.

Next: [Adding Functionality](adding-functionality.html)
