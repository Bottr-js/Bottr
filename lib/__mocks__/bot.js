const Server = require('./server');

const mock = {
  on: jest.fn(),
  use: jest.fn(),
  connectToSocket: jest.fn(),
  trigger: jest.fn(),
  listen: jest.fn(() =>
    new Server()
  ),
};

module.exports = () => mock;
