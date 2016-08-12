var HTTP = require('http');

var content = '&lt;html&gt;&lt;body&gt;&lt;p&gt;Hello World&lt;/p&gt;&lt;script type=”text/javascript”'
    +'>alert(“Hi!”);&lt;/script&gt;&lt;/body&gt;&lt;/html&gt;';

function FacebookMessengerClient() {}

FacebookMessengerClient.prototype.start = function(bot) {
  HTTP.createServer(function (request, response) {
   response.end(content);
  }).listen(80, 'localhost');
};

FacebookMessengerClient.prototype.speak = function(message) {
  console.log(message);
}

module.exports = FacebookMessengerClient;
