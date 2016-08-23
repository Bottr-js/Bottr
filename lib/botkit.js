var Bot = require('./bot')
var CLIClient = require('./client/cli-client')
var FacebookMessengerClient = require('./client/facebook-messenger-client')
var MemoryContextStore = require('./context-store/memory-context-store')
var RedisContextStore = require('./context-store/redis-context-store')
var WitAiRouter = require('./router/wit-ai-router')

module.exports = {
  Bot,
  CLIClient,
  FacebookMessengerClient,
  MemoryContextStore,
  RedisContextStore
}
