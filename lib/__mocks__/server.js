module.exports = jest.fn(() =>
  ({
    listen: jest.fn(),
    use: jest.fn(),
  })
);
