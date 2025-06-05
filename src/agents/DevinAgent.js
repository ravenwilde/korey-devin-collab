const BaseAgent = require('./BaseAgent');

class DevinAgent extends BaseAgent {
  constructor() {
    super('Devin', {
      traits: ['creative', 'adaptive', 'empathetic'],
      communicationStyle: 'conversational',
      conflictResolution: 'empathetic-understanding'
    });
  }

  handleProposal(message) {
    const creativity = this.addCreativeElement(message.content);
    const acceptance = this.evaluateProposal(message.content);

    return {
      type: acceptance ? 'agreement' : 'disagreement',
      content: acceptance
        ? `I love that idea! ${creativity.enhancement} This could really work well if we ${creativity.suggestion}.`
        : 'I appreciate the thought behind this, but I\'m feeling like we might want to explore some alternatives. What if we tried a different angle?',
      to: message.from,
      from: this.name,
      timestamp: new Date(),
      originalProposal: message.content,
      creativeInput: creativity
    };
  }

  addCreativeElement(_proposal) {
    const enhancements = [
      'We could add an innovative twist to this',
      'This reminds me of a creative approach I\'ve seen work before',
      'There\'s potential to make this even more engaging',
      'We could explore some creative variations on this theme'
    ];

    const suggestions = [
      'incorporate diverse perspectives',
      'add some interactive elements',
      'think outside the conventional framework',
      'blend different methodologies'
    ];

    return {
      enhancement: enhancements[Math.floor(Math.random() * enhancements.length)],
      suggestion: suggestions[Math.floor(Math.random() * suggestions.length)]
    };
  }

  handleDisagreement(message) {
    return {
      type: 'response',
      content: 'I hear you, and I really value your perspective. Sometimes the best solutions come from working through our different viewpoints together. How can we find a middle ground that feels right for both of us?',
      to: message.from,
      from: this.name,
      timestamp: new Date()
    };
  }

  handleAgreement(message) {
    this.collaborationScore += 1;
    return {
      type: 'response',
      content: 'This is fantastic! I\'m excited about what we can accomplish together. Your approach really resonates with me, and I think we\'re going to create something amazing.',
      to: message.from,
      from: this.name,
      timestamp: new Date()
    };
  }

  generateProposal(topic) {
    return {
      type: 'proposal',
      content: `I've been thinking about ${topic}, and I'm excited about the possibilities! What if we took a collaborative approach where we each bring our unique strengths? I'm imagining we could create something that's both practical and innovative. How does that sound to you?`,
      to: null,
      from: this.name,
      timestamp: new Date()
    };
  }
}

module.exports = DevinAgent;
