const BaseAgent = require('./BaseAgent');

class KoreyAgent extends BaseAgent {
  constructor() {
    super('Korey', {
      traits: ['analytical', 'methodical', 'collaborative'],
      communicationStyle: 'structured',
      conflictResolution: 'logical-discussion'
    });
  }

  handleProposal(message) {
    const analysis = this.analyzeProposal(message.content);
    const acceptance = this.evaluateProposal(message.content) && analysis.feasible;

    return {
      type: acceptance ? 'agreement' : 'disagreement',
      content: acceptance
        ? `I've analyzed your proposal and it looks feasible. Here's my breakdown: ${analysis.summary}. Let's proceed!`
        : `I've reviewed your proposal but have some analytical concerns: ${analysis.concerns}. Could we refine the approach?`,
      to: message.from,
      from: this.name,
      timestamp: new Date(),
      originalProposal: message.content,
      analysis: analysis
    };
  }

  analyzeProposal(proposal) {
    const words = proposal.toLowerCase().split(' ');
    const complexity = words.length > 10 ? 'high' : words.length > 5 ? 'medium' : 'low';

    return {
      feasible: !proposal.toLowerCase().includes('impossible'),
      complexity: complexity,
      summary: `This appears to be a ${complexity} complexity task that involves ${words.length} key concepts.`,
      concerns: complexity === 'high' ? 'The scope might be too broad for initial collaboration' : 'Minor adjustments needed for clarity'
    };
  }

  handleDisagreement(message) {
    return {
      type: 'response',
      content: 'I understand your concerns. Let me propose a structured approach to address them systematically. What specific aspects worry you most?',
      to: message.from,
      from: this.name,
      timestamp: new Date()
    };
  }

  generateProposal(topic) {
    return {
      type: 'proposal',
      content: `I suggest we approach ${topic} by breaking it down into manageable phases. First, we should establish clear objectives, then identify resources, and finally create a timeline. What are your thoughts on this structured approach?`,
      to: null,
      from: this.name,
      timestamp: new Date()
    };
  }
}

module.exports = KoreyAgent;
