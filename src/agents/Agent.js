class Agent {
  constructor(name, personality = {}) {
    this.name = name;
    this.personality = personality;
    this.messageBus = null;
    this.conversationHistory = [];
  }

  setMessageBus(messageBus) {
    this.messageBus = messageBus;
  }

  async sendMessage(content, recipient = null, type = 'text') {
    if (!this.messageBus) {
      throw new Error('Message bus not configured');
    }
    
    const message = await this.messageBus.sendMessage(this.name, content, recipient, type);
    this.conversationHistory.push(message);
    return message;
  }

  async receiveMessage(message) {
    this.conversationHistory.push(message);
    
    if (this.conversationHistory.length > 20) {
      return; // Stop processing after 20 messages
    }
    
    return this.processMessage(message);
  }

  async processMessage(message) {
    return `${this.name} received: ${message.content}`;
  }

  getPersonalityTrait(trait) {
    return this.personality[trait] || null;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}

module.exports = Agent;
