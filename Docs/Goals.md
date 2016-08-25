# Pozi

This document aims to set out the design philosophy of Pozi against Botkit and
Hubot. This will help to drive and focus the direction of development by setting
out goals of the framework and how Pozi will be different compared to other frameworks.

# Existing frameworks

Pozi and existing frameworks aim to handle a lot of the boilerplate with making a Bot.
This handles communicating with clients such as Facebook, Twitter and Slack. Storing
information about a conversation, listening to messages and handling threading of
conversations.

Right now Pozi is built on these two frameworks to get the best of both worlds but
in the long term we would like to build out the parts that add the most value and reduce
it down to the elements we need (reducing dependencies).

## Hubot

### Pros

- Large amount of scripts
- Large amount of integrations
- Easy to load in adapter for new integrations
- Mature APIs for things such as API and Storage
- Easily filter messages interested in
- Simple API with very few boilerplate

### Cons

- Built specifically for one off dev-ops tasks
- Hard to distribute publicly (i.e "Add To Slack")
- Mainly for internal tools and teams.
- Hard to run multiple on the same server
- Integrations mainly limited to basic replies, no extra features.
- Some integrations don't have consistent API or endpoints (i.e Twilio)
- Heavy

## BotKit

### Pros

- Light weight
- Built for conversational based bots
- Easy to distribute publicly (i.e "Add To Slack")
- Integrations support advanced features.
- Easy to run multiple on same server
- Event based
- Easily filter messages interested in

### Cons

- Small amount of integrations
- Can't have same logic shared across different integrations
- Verbose API with a lot of boilerplate (i.e fetching context and setting up webhooks)

# Goals for Pozi

- Focused on User facing, no-setup required bots.
- Light weight
- Event based
- Built for conversational based bots
- Easy to distribute publicly (i.e "Add To Slack")
- Integrations support advanced features.
- Easily filter messages interested in
- Large amount of user facing integrations
- Simple API with little boilerplate
- Easy to load in adapter for new integrations
- Same logic shared across different integrations
- Easy to run multiple on same server
- Easy to integrate into express.js
- Easy to test via web interface.
