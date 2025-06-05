const CollaborationMetrics = require('../src/assessment/CollaborationMetrics');

describe('CollaborationMetrics', () => {
  let metrics;

  beforeEach(() => {
    metrics = new CollaborationMetrics();
  });

  test('should initialize with zero metrics', () => {
    const initialMetrics = metrics.getMetrics();

    expect(initialMetrics.totalInteractions).toBe(0);
    expect(initialMetrics.successfulAgreements).toBe(0);
    expect(initialMetrics.conflictResolutions).toBe(0);
    expect(initialMetrics.communicationQuality).toBe(0);
    expect(initialMetrics.collaborationEffectiveness).toBe(0);
    expect(initialMetrics.peacefulnessScore).toBe(0);
  });

  test('should analyze basic collaboration metrics', () => {
    const mockSummary = {
      sessionId: 'test-session',
      messageHistory: [
        { type: 'greeting', content: 'Hello, nice to meet you!', from: 'Agent1' },
        { type: 'proposal', content: 'Let us collaborate peacefully', from: 'Agent1' },
        { type: 'agreement', content: 'I love that idea!', from: 'Agent2' }
      ],
      agents: [
        { name: 'Agent1', collaborationScore: 2 },
        { name: 'Agent2', collaborationScore: 1 }
      ]
    };

    const report = metrics.analyzeCollaboration(mockSummary);

    expect(report.metrics.totalInteractions).toBe(3);
    expect(report.metrics.successfulAgreements).toBe(1);
    expect(report.metrics.communicationQuality).toBeGreaterThan(50);
    expect(report.metrics.peacefulnessScore).toBeGreaterThan(0);
  });

  test('should detect conflict resolutions', () => {
    const messageHistory = [
      { type: 'disagreement', content: 'I disagree with that approach', from: 'Agent1' },
      { type: 'response', content: 'I understand your concerns, let us find a solution', from: 'Agent2' }
    ];

    const conflictResolutions = metrics.countConflictResolutions(messageHistory);
    expect(conflictResolutions).toBe(1);
  });

  test('should assess communication quality', () => {
    const positiveMessages = [
      { type: 'greeting', content: 'Thank you for the wonderful collaboration!', from: 'Agent1' },
      { type: 'response', content: 'I appreciate your excellent ideas', from: 'Agent2' }
    ];

    const negativeMessages = [
      { type: 'response', content: 'That is a terrible and stupid idea', from: 'Agent1' }
    ];

    metrics.assessCommunicationQuality(positiveMessages);
    const positiveQuality = metrics.getMetrics().communicationQuality;

    metrics.reset();
    metrics.assessCommunicationQuality(negativeMessages);
    const negativeQuality = metrics.getMetrics().communicationQuality;

    expect(positiveQuality).toBeGreaterThan(negativeQuality);
  });

  test('should calculate peacefulness score', () => {
    const peacefulMessages = [
      { type: 'greeting', content: 'Let us collaborate peacefully and work together in harmony', from: 'Agent1' }
    ];

    const aggressiveMessages = [
      { type: 'response', content: 'We should fight and oppose each other in this conflict', from: 'Agent1' }
    ];

    metrics.calculatePeacefulnessScore(peacefulMessages);
    const peacefulScore = metrics.getMetrics().peacefulnessScore;

    metrics.reset();
    metrics.calculatePeacefulnessScore(aggressiveMessages);
    const aggressiveScore = metrics.getMetrics().peacefulnessScore;

    expect(peacefulScore).toBeGreaterThan(aggressiveScore);
  });

  test('should generate comprehensive report', () => {
    const mockSummary = {
      sessionId: 'test-session',
      duration: 30000,
      task: 'test collaboration',
      messageHistory: [
        { type: 'greeting', content: 'Hello, wonderful to meet you!', from: 'Agent1' },
        { type: 'proposal', content: 'Let us collaborate peacefully together', from: 'Agent1' },
        { type: 'agreement', content: 'Excellent idea! I love working together', from: 'Agent2' }
      ],
      agents: [
        { name: 'Agent1', collaborationScore: 3 },
        { name: 'Agent2', collaborationScore: 2 }
      ]
    };

    const report = metrics.analyzeCollaboration(mockSummary);

    expect(report.sessionId).toBe('test-session');
    expect(report.assessment).toBeDefined();
    expect(report.assessment.overallRating).toBeDefined();
    expect(report.assessment.peacefulCollaboration).toBe(true);
    expect(report.recommendations).toBeDefined();
    expect(Array.isArray(report.recommendations)).toBe(true);
  });

  test('should identify strengths and weaknesses', () => {
    metrics.metrics.communicationQuality = 80;
    metrics.metrics.peacefulnessScore = 90;
    metrics.metrics.successfulAgreements = 3;

    const strengths = metrics.identifyStrengths();
    expect(strengths).toContain('High quality communication');
    expect(strengths).toContain('Excellent peaceful interaction');
    expect(strengths).toContain('Strong agreement-building');

    metrics.reset();
    metrics.metrics.communicationQuality = 30;
    metrics.metrics.collaborationEffectiveness = 20;
    metrics.metrics.peacefulnessScore = 40;

    const weaknesses = metrics.identifyWeaknesses();
    expect(weaknesses.length).toBeGreaterThan(0);
  });

  test('should reset metrics correctly', () => {
    metrics.metrics.totalInteractions = 10;
    metrics.metrics.successfulAgreements = 5;

    metrics.reset();

    const resetMetrics = metrics.getMetrics();
    expect(resetMetrics.totalInteractions).toBe(0);
    expect(resetMetrics.successfulAgreements).toBe(0);
  });
});
