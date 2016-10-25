/* global spyOn */

jest.unmock('../lib/event-emitter');

const EventEmitter = require('../lib/event-emitter');

it('should register listener', () => {
  const emitter = new EventEmitter();
  const handler = jest.fn();
  emitter.addListener('event', handler);
  expect(emitter.listeners).toEqual([
    {
      eventName: 'event',
      handler,
    },
  ]);
});

it('should register listener', () => {
  const emitter = new EventEmitter();
  const handler = jest.fn();
  emitter.addListener('event', handler);
  expect(emitter.listeners).toEqual([
    {
      eventName: 'event',
      handler,
    },
  ]);
});

it('should register fallback', () => {
  const emitter = new EventEmitter();
  const handler = jest.fn();
  emitter.fallback('event', handler);
  expect(emitter.fallbacks.event).toEqual(handler);
});

it('should emit event with correct handlers', () => {
  const emitter = new EventEmitter();
  const handler = jest.fn();
  const handler2 = jest.fn();
  emitter.addListener('event', handler);
  emitter.addListener('event2', handler2);
  const event = emitter.emit('event');
  expect(event.remainingListeners).toEqual([handler]);
});

it('should emit event with correct arguments', () => {
  const emitter = new EventEmitter();
  const handler = jest.fn();
  emitter.addListener('event', handler);
  const event = emitter.emit('event', 1);
  expect(event.args).toEqual([
    1,
  ]);
});

it('should use fallback for event with no handlers', () => {
  const emitter = new EventEmitter();
  const handler = jest.fn();
  emitter.fallback('event', handler);
  emitter.emit('event');
  expect(handler).toBeCalled();
});

it('should log error for event with no handlers or fallback', () => {
  jest.mock('console');
  const emitter = new EventEmitter();
  const spy = spyOn(console, 'error');
  emitter.emit('event');
  expect(spy).toBeCalled();
});
