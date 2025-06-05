const { EventEmitter } = require('events');

class MessageBus extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.messageHistory = [];
    this.isActive = false;
  }

  registerAgent(agent) {
    if (!agent || !agent.name) {
      throw new Error('Agent must have a name property');
    }

    this.agents.set(agent.name, agent);
    agent.activate();

    this.emit('agentRegistered', {
      agentName: agent.name,
      timestamp: new Date()
    });
  }

  unregisterAgent(agentName) {
    const agent = this.agents.get(agentName);
    if (agent) {
      agent.deactivate();
      this.agents.delete(agentName);

      this.emit('agentUnregistered', {
        agentName: agentName,
        timestamp: new Date()
      });
    }
  }

  sendMessage(message) {
    if (!this.validateMessage(message)) {
      throw new Error('Invalid message format');
    }

    this.messageHistory.push({
      ...message,
      id: this.generateMessageId(),
      timestamp: message.timestamp || new Date()
    });

    if (message.to) {
      this.deliverToAgent(message);
    } else {
      this.broadcast(message);
    }

    this.emit('messageSent', message);
  }

  deliverToAgent(message) {
    const recipient = this.agents.get(message.to);
    if (!recipient) {
      this.emit('deliveryFailed', {
        message: message,
        reason: `Agent ${message.to} not found`,
        timestamp: new Date()
      });
      return;
    }

    try {
      const response = recipient.perceive(message);
      if (response && response.type !== 'response') {
        setTimeout(() => {
          this.sendMessage(response);
        }, this.getResponseDelay());
      }
    } catch (error) {
      this.emit('deliveryError', {
        message: message,
        error: error.message,
        timestamp: new Date()
      });
    }
  }

  broadcast(message) {
    const sender = message.from;
    for (const [agentName] of this.agents) {
      if (agentName !== sender) {
        const broadcastMessage = {
          ...message,
          to: agentName
        };
        this.deliverToAgent(broadcastMessage);
      }
    }
  }

  validateMessage(message) {
    const requiredFields = ['type', 'content', 'from'];
    return requiredFields.every(field => Object.prototype.hasOwnProperty.call(message, field));
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getResponseDelay() {
    return Math.random() * 1000 + 500;
  }

  getMessageHistory() {
    return this.messageHistory;
  }

  getRegisteredAgents() {
    return Array.from(this.agents.keys());
  }

  clearHistory() {
    this.messageHistory = [];
  }

  start() {
    this.isActive = true;
    this.emit('busStarted', { timestamp: new Date() });
  }

  stop() {
    this.isActive = false;
    this.emit('busStopped', { timestamp: new Date() });
  }

  getStats() {
    return {
      totalMessages: this.messageHistory.length,
      activeAgents: this.agents.size,
      isActive: this.isActive,
      messageTypes: this.getMessageTypeStats()
    };
  }

  getMessageTypeStats() {
    const stats = {};
    this.messageHistory.forEach(msg => {
      stats[msg.type] = (stats[msg.type] || 0) + 1;
    });
    return stats;
  }
}

module.exports = MessageBus;
