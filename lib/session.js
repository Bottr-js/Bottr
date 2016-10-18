const queue = require('queue');

class Session {
  constructor(bot, user, client) {
    this.bot = bot;
    this.queue = queue();
    this.queue.concurrency = 1;

    this.user = user;
    this.client = client;
  }

  send(text, attachment) {
    const session = this;

    this.queue.push((cb) => {
      session.startTyping();

      let typingTime = 0;

      if (text) {
        const averageWordsPerMinute = 600;
        const averageWordsPerSecond = averageWordsPerMinute / 60;
        const averageWordsPerMillisecond = averageWordsPerSecond / 1000;
        const totalWords = text.split(' ').length;
        typingTime = totalWords / averageWordsPerMillisecond;
      }

      setTimeout(() => {
        session.client.send(session, text, attachment);
        cb();
      }, typingTime);
    });

    this.queue.start();
  }

  startTyping() {
    this.client.startTyping(this);
  }

  startTopic(topicID) {
    console.log(`Started Topic ${topicID}`);
    this.updateUserContext({
      currentTopic: topicID,
    });
  }

  finishTopic() {
    console.log('Finished Topic');
    this.updateUserContext({
      currentTopic: undefined,
    });
  }

  getUserContext(defaults) {
    const context = this.bot.memory.users[this.user] || {};
    return Object.assign({}, defaults || {}, context);
  }

  updateUserContext(newValues) {
    const context = this.bot.memory.users[this.user] || {};
    this.bot.memory.users[this.user] = Object.assign(context, newValues);
  }
}
module.exports = Session;
