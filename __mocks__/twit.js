const stream = {
  on: jest.fn(),
};

module.exports = jest.fn(() => ({
  stream: jest.fn(() => stream),
  post: jest.fn(),
}));
