module.exports = () => ({
  push: jest.fn((callback) => {
    callback();
  }),
  start: jest.fn(),
});
