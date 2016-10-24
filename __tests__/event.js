jest.unmock('../lib/event');

const Event = require('../lib/event');

it('should call handler', () => {
  const handler = jest.fn();
  const event = new Event([handler], []);
  event.next(jest.fn());
  expect(handler).toBeCalled();
});

it('should call next handler when previous handler doesn\'t handle event', () => {
  const handler = (next) => {
    next();
  };
  const handler2 = jest.fn();
  const event = new Event([handler, handler2], []);
  event.next(jest.fn());
  expect(handler2).toBeCalled();
});

it('should call unhandled callback if no handler handles event', () => {
  const callback = jest.fn();
  const event = new Event([], []);
  event.next(callback);
  expect(callback).toBeCalled();
});
