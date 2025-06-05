const { v4: uuidv4 } = require('uuid');

class BaseAgent {
  constructor(name, personality = {}) {
    this.id = uuidv4();
    this.name = name;
    this.personality = personality;
    this.memory = [];
    this.isActive = false;
    this.collaborationScore = 0;
    this.messageHistory = [];
  }

  perceive(message) {
    this.messageHistory.push({
      timestamp: new Date(),
      type: 'received',
      content: message,
      from: message.from
    });

    this.memory.push({
      timestamp: new Date(),
      type: 'perception',
      data: message
    });

    return this.processMessage(message);
  }

  processMessage(message) {
    switch (message.type) {
    case 'greeting':
      return this.handleGreeting(message);
    case 'proposal':
      return this.handleProposal(message);
    case 'response':
      return this.handleResponse(message);
    case 'agreement':
      return this.handleAgreement(message);
    case 'disagreement':
      return this.handleDisagreement(message);
    default:
      return this.handleGeneral(message);
    }
  }

  handleGreeting(message) {
    return {
      type: 'response',
      content: `Hello ${message.from}! Nice to meet you. I'm ${this.name}.`,
      to: message.from,
      from: this.name,
      timestamp: new Date()
    };
  }

  handleProposal(message) {
    const acceptance = this.evaluateProposal(message.content);
    return {
      type: acceptance ? 'agreement' : 'disagreement',
      content: acceptance
        ? `I think that's a great idea! Let's work on: ${message.content}`
        : 'I have some concerns about that approach. Could we consider alternatives?',
      to: message.from,
      from: this.name,
      timestamp: new Date(),
      originalProposal: message.content
    };
  }

  handleResponse(_message) {
    return null;
  }

  handleAgreement(message) {
    this.collaborationScore += 1;
    return {
      type: 'response',
      content: 'Excellent! I\'m glad we\'re in agreement. Let\'s move forward together.',
      to: message.from,
      from: this.name,
      timestamp: new Date()
    };
  }

  handleDisagreement(message) {
    return {
      type: 'response',
      content: 'I respect your perspective. Let\'s find a solution that works for both of us.',
      to: message.from,
      from: this.name,
      timestamp: new Date()
    };
  }

  handleGeneral(message) {
    return {
      type: 'response',
      content: 'Thank you for sharing that with me.',
      to: message.from,
      from: this.name,
      timestamp: new Date()
    };
  }

  evaluateProposal(proposal) {
    const positiveWords = ['collaborate', 'together', 'help', 'support', 'peaceful', 'kind'];
    const negativeWords = ['conflict', 'fight', 'oppose', 'against', 'harmful'];

    const proposalLower = proposal.toLowerCase();
    const positiveCount = positiveWords.filter(word => proposalLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => proposalLower.includes(word)).length;

    return positiveCount > negativeCount;
  }

  learn(experience) {
    this.memory.push({
      timestamp: new Date(),
      type: 'learning',
      data: experience
    });

    if (experience.successful) {
      this.collaborationScore += 0.5;
    }
  }

  getCollaborationScore() {
    return this.collaborationScore;
  }

  getMemory() {
    return this.memory;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}

module.exports = BaseAgent;
