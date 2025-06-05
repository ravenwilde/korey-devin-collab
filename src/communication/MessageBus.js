const Message = require('./Message');
const Logger = require('../utils/logger');

class MessageBus {
  constructor() {
    this.agents = new Map();
    this.messageHistory = [];
    this.logger = new Logger();
  }

  registerAgent(agent) {
    this.agents.set(agent.name, agent);
    agent.setMessageBus(this);
    this.logger.log('info', `Agent ${agent.name} registered with message bus`);
  }

  async sendMessage(senderName, content, recipientName = null, type = 'text') {
    const message = new Message(senderName, content, recipientName, type);
    this.messageHistory.push(message);
    
    this.logger.log('info', `Message sent from ${senderName} to ${recipientName || 'all'}`, {
      messageId: message.id,
      type: message.type,
      contentLength: content.length
    });

    if (recipientName) {
      const recipient = this.agents.get(recipientName);
      if (recipient) {
        await recipient.receiveMessage(message);
      } else {
        this.logger.log('warn', `Recipient ${recipientName} not found`);
      }
    } else {
      for (const [agentName, agent] of this.agents) {
        if (agentName !== senderName) {
          await agent.receiveMessage(message);
        }
      }
    }

    return message;
  }

  getMessageHistory() {
    return this.messageHistory;
  }

  getMessagesForAgent(agentName) {
    return this.messageHistory.filter(msg => 
      msg.sender === agentName || msg.recipient === agentName || msg.recipient === null
    );
  }

  clearHistory() {
    this.messageHistory = [];
    this.logger.log('info', 'Message history cleared');
  }

  exportHistory() {
    return this.messageHistory.map(msg => msg.toJSON());
  }
}

module.exports = MessageBus;
