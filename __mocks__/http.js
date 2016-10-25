module.exports = {
  Server: app => ({
    app,
    listen: jest.fn(),
  }),
};
