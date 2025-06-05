const DevinAgent = require('../src/agents/DevinAgent');

describe('DevinAgent', () => {
  let devin;

  beforeEach(() => {
    devin = new DevinAgent();
  });

  test('should create Devin with creative personality', () => {
    expect(devin.name).toBe('Devin');
    expect(devin.personality.traits).toContain('creative');
    expect(devin.personality.traits).toContain('adaptive');
    expect(devin.personality.traits).toContain('empathetic');
    expect(devin.personality.communicationStyle).toBe('conversational');
  });

  test('should add creative elements to proposals', () => {
    const proposalMessage = {
      type: 'proposal',
      content: 'Let us work on a project together',
      from: 'Korey',
      timestamp: new Date()
    };

    const response = devin.perceive(proposalMessage);

    expect(response.creativeInput).toBeDefined();
    expect(response.creativeInput.enhancement).toBeDefined();
    expect(response.creativeInput.suggestion).toBeDefined();
    expect(response.content).toContain('love that idea');
  });

  test('should generate enthusiastic proposals', () => {
    const proposal = devin.generateProposal('creative collaboration');

    expect(proposal.type).toBe('proposal');
    expect(proposal.content).toContain('excited');
    expect(proposal.content).toContain('collaborative approach');
    expect(proposal.content).toContain('unique strengths');
    expect(proposal.from).toBe('Devin');
  });

  test('should handle disagreements empathetically', () => {
    const disagreementMessage = {
      type: 'disagreement',
      content: 'I disagree with this approach',
      from: 'Korey',
      timestamp: new Date()
    };

    const response = devin.perceive(disagreementMessage);

    expect(response.content).toContain('hear you');
    expect(response.content).toContain('value your perspective');
    expect(response.content).toContain('middle ground');
  });

  test('should show enthusiasm for agreements', () => {
    const agreementMessage = {
      type: 'agreement',
      content: 'I agree with your creative approach',
      from: 'Korey',
      timestamp: new Date()
    };

    const response = devin.perceive(agreementMessage);

    expect(response.content).toContain('fantastic');
    expect(response.content).toContain('excited');
    expect(response.content).toContain('amazing');
    expect(devin.collaborationScore).toBe(1);
  });

  test('should add creative enhancements', () => {
    const enhancement = devin.addCreativeElement('basic project plan');

    expect(enhancement.enhancement).toBeDefined();
    expect(enhancement.suggestion).toBeDefined();
    expect(typeof enhancement.enhancement).toBe('string');
    expect(typeof enhancement.suggestion).toBe('string');
  });
});
