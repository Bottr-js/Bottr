jest.unmock('../../lib/context-store/memory-context-store.js');

const MemoryContextStore = require('../../lib/context-store/memory-context-store.js');

describe('memory context store', () => {

  it('calls callback once constructed', () => {
    var callback = jest.fn()
    var contextStore = new MemoryContextStore(callback)
    expect(callback).toBeCalled()
  })

  it('stores context', () => {
    var contextStore = new MemoryContextStore(jest.fn())
    contextStore.set("key", {})
    expect(contextStore.memory["key"]).toBeTruthy()
  });

  it('retrieves context', () => {
    var contextStore = new MemoryContextStore(jest.fn())
    contextStore.memory = {"key": {}}
    contextStore.get("key", (context) => {
      expect(context).toBeTruthy()
    })
  });
});
