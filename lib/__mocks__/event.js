module.exports = (remainingListeners, args) =>
  ({
    remainingListeners,
    args,
    next: jest.fn((callback) => {
      callback();
    }),
  });
