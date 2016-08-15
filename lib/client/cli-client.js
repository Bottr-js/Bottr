var Repl = require('repl');

function CLIClient() {}

CLIClient.prototype.start = function(bot) {
  this.replServer = Repl.start({
    prompt: "BotKit > ",
    eval: function(cmd, context, filename, callback) {
      console.log("\n")
      bot.didRecieveMessage(cmd, {}, function() {
        callback(null, undefined);
      })
    }
  });
};

CLIClient.prototype.send = function(message) {
  console.log(message);
}

module.exports = CLIClient;
