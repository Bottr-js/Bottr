function Context(storage, subject) {
  this.storage = storage
  this.subject = subject

  this.fetchFromSource = function(source, id) {
    return new Promise(function(resolve, reject) {
      source.get(id, function(err, data) {
        if (!err) {
          resolve((data) ? data.context : {})
        } else {
          reject(err)
        }
      });
    })
  }

  this.storeToSource = function(source, id, context) {
    source.save({
      id: id,
      context: context
    }, function(){})
  }

  return this
}

Context.prototype.fetch = function() {
  return Promise.all([
    this.fetchFromSource(this.storage.users, this.subject.user),
    this.fetchFromSource(this.storage.channels, this.subject.channel),
    this.fetchFromSource(this.storage.teams, this.subject.team),
  ])
  .then(function(results) {
    this.user = results[0]
    this.channel = results[1]
    this.team = results[2]
  }.bind(this))
}

Context.prototype.save = function() {
  this.storeToSource(this.storage.users, this.subject.user, this.user)
  this.storeToSource(this.storage.channels, this.subject.channel, this.channel)
  this.storeToSource(this.storage.teams, this.subject.team, this.team)
}

module.exports = Context
