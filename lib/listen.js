const Server = require('./server');
const Bot = require('./bot');

Bot.prototype.listen = function (port) {
  const serverPort = port || process.env.PORT || 3000;
  const server = new Server();

  server.use(this);
  server.listen(serverPort);

  return server;
};
