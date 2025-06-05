class CollaborationMetrics {
  constructor() {
    this.metrics = {
      totalInteractions: 0,
      successfulAgreements: 0,
      conflictResolutions: 0,
      communicationQuality: 0,
      collaborationEffectiveness: 0,
      peacefulnessScore: 0
    };
  }

  analyzeCollaboration(collaborationSummary) {
    const { messageHistory, agents } = collaborationSummary;

    this.calculateBasicMetrics(messageHistory);
    this.assessCommunicationQuality(messageHistory);
    this.evaluateCollaborationEffectiveness(messageHistory, agents);
    this.calculatePeacefulnessScore(messageHistory);

    return this.generateReport(collaborationSummary);
  }

  calculateBasicMetrics(messageHistory) {
    this.metrics.totalInteractions = messageHistory.length;

    this.metrics.successfulAgreements = messageHistory.filter(
      msg => msg.type === 'agreement'
    ).length;

    this.metrics.conflictResolutions = this.countConflictResolutions(messageHistory);
  }

  countConflictResolutions(messageHistory) {
    let resolutions = 0;
    let inConflict = false;

    for (const message of messageHistory) {
      if (message.type === 'disagreement') {
        inConflict = true;
      } else if (inConflict && (message.type === 'agreement' || message.type === 'response')) {
        const content = message.content.toLowerCase();
        if (content.includes('understand') || content.includes('compromise') ||
            content.includes('middle ground') || content.includes('solution')) {
          resolutions++;
          inConflict = false;
        }
      }
    }

    return resolutions;
  }

  assessCommunicationQuality(messageHistory) {
    if (messageHistory.length === 0) {
      this.metrics.communicationQuality = 0;
      return;
    }

    let qualityScore = 0;
    const positiveIndicators = [
      'thank', 'please', 'understand', 'appreciate', 'respect',
      'great', 'excellent', 'wonderful', 'fantastic', 'love'
    ];

    const negativeIndicators = [
      'stupid', 'wrong', 'terrible', 'hate', 'awful', 'bad'
    ];

    for (const message of messageHistory) {
      const content = message.content.toLowerCase();

      const positiveCount = positiveIndicators.filter(word =>
        content.includes(word)
      ).length;

      const negativeCount = negativeIndicators.filter(word =>
        content.includes(word)
      ).length;

      qualityScore += (positiveCount * 2) - (negativeCount * 3);
    }

    this.metrics.communicationQuality = Math.max(0, Math.min(100,
      (qualityScore / messageHistory.length) * 10 + 50
    ));
  }

  evaluateCollaborationEffectiveness(messageHistory, agents) {
    if (agents.length === 0) {
      this.metrics.collaborationEffectiveness = 0;
      return;
    }

    const avgCollaborationScore = agents.reduce(
      (sum, agent) => sum + agent.collaborationScore, 0
    ) / agents.length;

    const proposalResponseRatio = this.calculateProposalResponseRatio(messageHistory);
    const conversationFlow = this.assessConversationFlow(messageHistory);

    this.metrics.collaborationEffectiveness = Math.min(100,
      (avgCollaborationScore * 20) +
      (proposalResponseRatio * 30) +
      (conversationFlow * 50)
    );
  }

  calculateProposalResponseRatio(messageHistory) {
    const proposals = messageHistory.filter(msg => msg.type === 'proposal').length;
    const responses = messageHistory.filter(msg =>
      msg.type === 'agreement' || msg.type === 'disagreement'
    ).length;

    return proposals === 0 ? 0 : Math.min(1, responses / proposals);
  }

  assessConversationFlow(messageHistory) {
    if (messageHistory.length < 2) return 0;

    let flowScore = 0;
    let previousSender = null;
    let turnTaking = 0;

    for (const message of messageHistory) {
      if (previousSender && previousSender !== message.from) {
        turnTaking++;
      }
      previousSender = message.from;
    }

    flowScore = turnTaking / (messageHistory.length - 1);
    return Math.min(1, flowScore * 2); // Normalize to 0-1
  }

  calculatePeacefulnessScore(messageHistory) {
    const peacefulIndicators = [
      'peaceful', 'calm', 'respectful', 'kind', 'gentle', 'understanding',
      'collaborate', 'together', 'harmony', 'cooperation', 'support'
    ];

    const aggressiveIndicators = [
      'fight', 'attack', 'angry', 'hostile', 'aggressive', 'conflict',
      'oppose', 'against', 'enemy', 'battle', 'war'
    ];

    let peacefulCount = 0;
    let aggressiveCount = 0;

    for (const message of messageHistory) {
      const content = message.content.toLowerCase();

      peacefulCount += peacefulIndicators.filter(word =>
        content.includes(word)
      ).length;

      aggressiveCount += aggressiveIndicators.filter(word =>
        content.includes(word)
      ).length;
    }

    const totalIndicators = peacefulCount + aggressiveCount;
    if (totalIndicators === 0) {
      this.metrics.peacefulnessScore = 75; // Neutral baseline
    } else {
      this.metrics.peacefulnessScore = Math.min(100,
        (peacefulCount / totalIndicators) * 100
      );
    }
  }

  generateReport(collaborationSummary) {
    const { sessionId, duration, agents, task } = collaborationSummary;

    return {
      sessionId: sessionId,
      timestamp: new Date(),
      duration: duration,
      task: task,
      participants: agents.map(agent => agent.name),
      metrics: { ...this.metrics },
      assessment: this.generateAssessment(),
      recommendations: this.generateRecommendations()
    };
  }

  generateAssessment() {
    const {
      communicationQuality,
      collaborationEffectiveness,
      peacefulnessScore,
      successfulAgreements,
      conflictResolutions
    } = this.metrics;

    let overallRating = 'Poor';
    const avgScore = (communicationQuality + collaborationEffectiveness + peacefulnessScore) / 3;

    if (avgScore >= 80) overallRating = 'Excellent';
    else if (avgScore >= 60) overallRating = 'Good';
    else if (avgScore >= 40) overallRating = 'Fair';

    return {
      overallRating: overallRating,
      overallScore: Math.round(avgScore),
      strengths: this.identifyStrengths(),
      weaknesses: this.identifyWeaknesses(),
      peacefulCollaboration: peacefulnessScore >= 70,
      successfulInteraction: successfulAgreements > 0 || conflictResolutions > 0
    };
  }

  identifyStrengths() {
    const strengths = [];
    const { communicationQuality, peacefulnessScore, successfulAgreements } = this.metrics;

    if (communicationQuality >= 70) strengths.push('High quality communication');
    if (peacefulnessScore >= 80) strengths.push('Excellent peaceful interaction');
    if (successfulAgreements >= 2) strengths.push('Strong agreement-building');

    return strengths;
  }

  identifyWeaknesses() {
    const weaknesses = [];
    const { communicationQuality, collaborationEffectiveness, peacefulnessScore } = this.metrics;

    if (communicationQuality < 50) weaknesses.push('Communication quality needs improvement');
    if (collaborationEffectiveness < 40) weaknesses.push('Collaboration effectiveness is low');
    if (peacefulnessScore < 60) weaknesses.push('Peaceful interaction could be enhanced');

    return weaknesses;
  }

  generateRecommendations() {
    const recommendations = [];
    const { communicationQuality, collaborationEffectiveness, peacefulnessScore } = this.metrics;

    if (communicationQuality < 60) {
      recommendations.push('Encourage more positive language and active listening');
    }

    if (collaborationEffectiveness < 50) {
      recommendations.push('Focus on structured proposal-response cycles');
    }

    if (peacefulnessScore < 70) {
      recommendations.push('Emphasize empathy and understanding in communications');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue current collaboration patterns - they are working well');
    }

    return recommendations;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reset() {
    this.metrics = {
      totalInteractions: 0,
      successfulAgreements: 0,
      conflictResolutions: 0,
      communicationQuality: 0,
      collaborationEffectiveness: 0,
      peacefulnessScore: 0
    };
  }
}

module.exports = CollaborationMetrics;
