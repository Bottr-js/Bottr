var Redis = require('redis');

function RedisContextStore() {
  this.redis = Redis.createClient();
}

RedisContextStore.prototype.start = function(callback) {
  this.redis.on('connect', callback);
}

RedisContextStore.prototype.get = function(key, callback) {
  this.redis.get(key, function(err, reply) {
    callback(reply);
  })
}

RedisContextStore.prototype.set = function(key, value) {
  this.redis.set(key, value)
}

module.exports = RedisContextStore;
