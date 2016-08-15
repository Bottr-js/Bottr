jest.unmock('../../lib/context-store/redis-context-store.js');

jest.setMock('redis', {
  createClient: function() {
    return {
      on: function(name, callback) {
        callback();
      },
      set: jest.fn(),
      get: function(key, callback) {
        callback(null, {})
      }
    }
  }
})

const RedisContextStore = require('../../lib/context-store/redis-context-store.js');

describe('memory context store', () => {

  it('calls callback once started', () => {
    var callback = jest.fn()

    var contextStore = new RedisContextStore()
    contextStore.start(callback)

    expect(callback).toBeCalled()
  })

  it('stores context', () => {
    var contextStore = new RedisContextStore()
    contextStore.set("key", {})
    expect(contextStore.redis.set).toBeCalled()
  });

  it('retrieves context', () => {
    var contextStore = new RedisContextStore()
    contextStore.get("key", (context) => {
      expect(context).toBeTruthy()
    })
  });
});
