const mock = {
  of: jest.fn(() => this),
  on: jest.fn(),
};

module.exports = () => mock;
