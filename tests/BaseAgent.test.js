const BaseAgent = require('../src/agents/BaseAgent');

describe('BaseAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new BaseAgent('TestAgent', { trait: 'test' });
  });

  test('should create agent with correct properties', () => {
    expect(agent.name).toBe('TestAgent');
    expect(agent.personality).toEqual({ trait: 'test' });
    expect(agent.memory).toEqual([]);
    expect(agent.isActive).toBe(false);
    expect(agent.collaborationScore).toBe(0);
    expect(agent.messageHistory).toEqual([]);
  });

  test('should handle greeting messages', () => {
    const greetingMessage = {
      type: 'greeting',
      content: 'Hello!',
      from: 'OtherAgent',
      timestamp: new Date()
    };

    const response = agent.perceive(greetingMessage);

    expect(response.type).toBe('response');
    expect(response.content).toContain('Hello OtherAgent');
    expect(response.content).toContain('TestAgent');
    expect(response.to).toBe('OtherAgent');
    expect(response.from).toBe('TestAgent');
  });

  test('should handle proposal messages', () => {
    const proposalMessage = {
      type: 'proposal',
      content: 'Let us collaborate together peacefully',
      from: 'OtherAgent',
      timestamp: new Date()
    };

    const response = agent.perceive(proposalMessage);

    expect(response.type).toBe('agreement');
    expect(response.content).toContain('great idea');
    expect(response.originalProposal).toBe(proposalMessage.content);
  });

  test('should reject negative proposals', () => {
    const negativeProposal = {
      type: 'proposal',
      content: 'Let us fight and create conflict',
      from: 'OtherAgent',
      timestamp: new Date()
    };

    const response = agent.perceive(negativeProposal);

    expect(response.type).toBe('disagreement');
    expect(response.content).toContain('concerns');
  });

  test('should handle agreement messages', () => {
    const agreementMessage = {
      type: 'agreement',
      content: 'I agree with your proposal',
      from: 'OtherAgent',
      timestamp: new Date()
    };

    const response = agent.perceive(agreementMessage);

    expect(response.type).toBe('response');
    expect(response.content).toContain('glad we\'re in agreement');
    expect(agent.collaborationScore).toBe(1);
  });

  test('should handle disagreement messages peacefully', () => {
    const disagreementMessage = {
      type: 'disagreement',
      content: 'I disagree with that approach',
      from: 'OtherAgent',
      timestamp: new Date()
    };

    const response = agent.perceive(disagreementMessage);

    expect(response.type).toBe('response');
    expect(response.content).toContain('respect your perspective');
    expect(response.content).toContain('solution that works for both');
  });

  test('should store messages in memory and history', () => {
    const message = {
      type: 'greeting',
      content: 'Hello!',
      from: 'OtherAgent',
      timestamp: new Date()
    };

    agent.perceive(message);

    expect(agent.memory.length).toBe(1);
    expect(agent.memory[0].type).toBe('perception');
    expect(agent.memory[0].data).toEqual(message);

    expect(agent.messageHistory.length).toBe(1);
    expect(agent.messageHistory[0].type).toBe('received');
    expect(agent.messageHistory[0].content).toEqual(message);
  });

  test('should learn from experiences', () => {
    const experience = { successful: true, description: 'Good collaboration' };

    agent.learn(experience);

    expect(agent.memory.length).toBe(1);
    expect(agent.memory[0].type).toBe('learning');
    expect(agent.memory[0].data).toEqual(experience);
    expect(agent.collaborationScore).toBe(0.5);
  });

  test('should activate and deactivate', () => {
    expect(agent.isActive).toBe(false);

    agent.activate();
    expect(agent.isActive).toBe(true);

    agent.deactivate();
    expect(agent.isActive).toBe(false);
  });

  test('should evaluate proposals correctly', () => {
    expect(agent.evaluateProposal('Let us collaborate together')).toBe(true);
    expect(agent.evaluateProposal('We should fight and oppose each other')).toBe(false);
    expect(agent.evaluateProposal('Help and support each other')).toBe(true);
  });
});
