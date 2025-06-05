const KoreyAgent = require('../src/agents/KoreyAgent');

describe('KoreyAgent', () => {
  let korey;

  beforeEach(() => {
    korey = new KoreyAgent();
  });

  test('should create Korey with analytical personality', () => {
    expect(korey.name).toBe('Korey');
    expect(korey.personality.traits).toContain('analytical');
    expect(korey.personality.traits).toContain('methodical');
    expect(korey.personality.traits).toContain('collaborative');
    expect(korey.personality.communicationStyle).toBe('structured');
  });

  test('should analyze proposals before responding', () => {
    const proposalMessage = {
      type: 'proposal',
      content: 'Let us create a comprehensive project plan with multiple phases',
      from: 'Devin',
      timestamp: new Date()
    };

    const response = korey.perceive(proposalMessage);

    expect(response.analysis).toBeDefined();
    expect(response.analysis.feasible).toBe(true);
    expect(response.analysis.complexity).toBe('medium');
    expect(response.analysis.summary).toContain('complexity task');
  });

  test('should generate structured proposals', () => {
    const proposal = korey.generateProposal('software development');

    expect(proposal.type).toBe('proposal');
    expect(proposal.content).toContain('structured approach');
    expect(proposal.content).toContain('phases');
    expect(proposal.content).toContain('objectives');
    expect(proposal.from).toBe('Korey');
  });

  test('should handle disagreements with logical approach', () => {
    const disagreementMessage = {
      type: 'disagreement',
      content: 'I have concerns about this approach',
      from: 'Devin',
      timestamp: new Date()
    };

    const response = korey.perceive(disagreementMessage);

    expect(response.content).toContain('structured approach');
    expect(response.content).toContain('systematically');
    expect(response.content).toContain('specific aspects');
  });

  test('should reject impossible proposals', () => {
    const impossibleProposal = {
      type: 'proposal',
      content: 'Let us do something impossible and collaborate',
      from: 'Devin',
      timestamp: new Date()
    };

    const response = korey.perceive(impossibleProposal);

    expect(response.type).toBe('disagreement');
    expect(response.analysis.feasible).toBe(false);
  });

  test('should assess proposal complexity correctly', () => {
    const simpleProposal = 'Let us work together';
    const complexProposal = 'Let us create a comprehensive multi-phase project with detailed analysis and extensive planning';

    const simpleAnalysis = korey.analyzeProposal(simpleProposal);
    const complexAnalysis = korey.analyzeProposal(complexProposal);

    expect(simpleAnalysis.complexity).toBe('low');
    expect(complexAnalysis.complexity).toBe('high');
  });
});
