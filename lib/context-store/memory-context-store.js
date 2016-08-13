function MemoryContextStore() {
  this.memory = {};
}

MemoryContextStore.prototype.start = function(callback) {
  callback();
}

MemoryContextStore.prototype.get = function(key, callback) {
  console.log(key + " G= " + JSON.stringify(value));
  callback(this.memory[key]);
}

MemoryContextStore.prototype.set = function(key, value) {
  console.log(key + " S= " + JSON.stringify(value));
  this.memory[key] = value;
}

module.exports = MemoryContextStore;
