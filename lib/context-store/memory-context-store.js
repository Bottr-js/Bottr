function MemoryContextStore() {
  this.memory = {};
}

MemoryContextStore.prototype.start = function(callback) {
  callback();
}

MemoryContextStore.prototype.get = function(key, callback) {
  callback(this.memory[key]);
}

MemoryContextStore.prototype.set = function(key, value) {
  console.log(value);
  this.memory[key] = value;
}

module.exports = MemoryContextStore;
