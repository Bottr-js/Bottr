const express = () => ({
  get: jest.fn(),
  use: jest.fn(),
});

express.Router = jest.fn(() => ({
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
}));

express.static = jest.fn();

module.exports = express;
