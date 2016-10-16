jest.unmock('../../lib/clients/base-client');

const Bot = require('../../lib/bot');
const BaseClient = require('../../lib/clients/base-client');

const bot = new Bot();

describe('base-client', () => {
  it('should create a new base bot', () => {
    const client = new BaseClient()(bot);
    expect(client.bot).toEqual(bot);
  });

  it('should create a new base bot with configs', () => {
    const client = new BaseClient({ foo: 'bar' })(bot);
    expect(client.config).toEqual({ foo: 'bar' });
  });
});
