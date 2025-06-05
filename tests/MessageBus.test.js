const MessageBus = require('../src/communication/MessageBus');
const BaseAgent = require('../src/agents/BaseAgent');

describe('MessageBus', () => {
  let messageBus;
  let agent1;
  let agent2;

  beforeEach(() => {
    messageBus = new MessageBus();
    agent1 = new BaseAgent('Agent1');
    agent2 = new BaseAgent('Agent2');
  });

  test('should register and unregister agents', () => {
    messageBus.registerAgent(agent1);
    expect(messageBus.getRegisteredAgents()).toContain('Agent1');
    expect(agent1.isActive).toBe(true);

    messageBus.unregisterAgent('Agent1');
    expect(messageBus.getRegisteredAgents()).not.toContain('Agent1');
    expect(agent1.isActive).toBe(false);
  });

  test('should validate messages correctly', () => {
    const validMessage = {
      type: 'greeting',
      content: 'Hello',
      from: 'Agent1'
    };

    const invalidMessage = {
      content: 'Hello'
    };

    expect(messageBus.validateMessage(validMessage)).toBe(true);
    expect(messageBus.validateMessage(invalidMessage)).toBe(false);
  });

  test('should send messages between agents', (done) => {
    messageBus.registerAgent(agent1);
    messageBus.registerAgent(agent2);

    const message = {
      type: 'greeting',
      content: 'Hello Agent2',
      from: 'Agent1',
      to: 'Agent2'
    };

    messageBus.on('messageSent', (sentMessage) => {
      expect(sentMessage.content).toBe('Hello Agent2');
      expect(messageBus.getMessageHistory().length).toBe(1);
      done();
    });

    messageBus.sendMessage(message);
  });

  test('should broadcast messages when no recipient specified', () => {
    messageBus.registerAgent(agent1);
    messageBus.registerAgent(agent2);

    const broadcastMessage = {
      type: 'greeting',
      content: 'Hello everyone',
      from: 'Agent1'
    };

    messageBus.sendMessage(broadcastMessage);

    expect(messageBus.getMessageHistory().length).toBe(1);
  });

  test('should handle delivery failures', (done) => {
    const message = {
      type: 'greeting',
      content: 'Hello NonExistent',
      from: 'Agent1',
      to: 'NonExistentAgent'
    };

    messageBus.on('deliveryFailed', (event) => {
      expect(event.reason).toContain('not found');
      done();
    });

    messageBus.sendMessage(message);
  });

  test('should generate message statistics', () => {
    messageBus.registerAgent(agent1);
    messageBus.registerAgent(agent2);

    const message1 = { type: 'greeting', content: 'Hello', from: 'Agent1', to: 'Agent2' };
    const message2 = { type: 'proposal', content: 'Let us work together', from: 'Agent2', to: 'Agent1' };

    messageBus.sendMessage(message1);
    messageBus.sendMessage(message2);

    const stats = messageBus.getStats();
    expect(stats.totalMessages).toBe(2);
    expect(stats.activeAgents).toBe(2);
    expect(stats.messageTypes.greeting).toBe(1);
    expect(stats.messageTypes.proposal).toBe(1);
  });

  test('should start and stop correctly', () => {
    expect(messageBus.isActive).toBe(false);

    messageBus.start();
    expect(messageBus.isActive).toBe(true);

    messageBus.stop();
    expect(messageBus.isActive).toBe(false);
  });

  test('should clear message history', () => {
    const message = { type: 'greeting', content: 'Hello', from: 'Agent1' };
    messageBus.sendMessage(message);

    expect(messageBus.getMessageHistory().length).toBe(1);

    messageBus.clearHistory();
    expect(messageBus.getMessageHistory().length).toBe(0);
  });
});
