---
title: "Bottr: Installation"
---
# Installation

It should only take three simple steps to get up and running with Bottr.

Install Node & NPM using Homebrew

```
$ brew install node
```

Install the Bottr command line tool

```
$ npm install -g bottr
```

Create a new project folder and initialise a new project

```
$ mkdir <YourBotName> && cd <YourBotName> && bottr init
```

Your project should have a `index.js` which declares a basic bot.

If you run `bottr start`, open `localhost:3000` in your browser and send it something the bot should reply with a response that indicates we haven't taught it to do anything yet.

Next: [Creating Your First Bot](creating-your-first-bot.html).
