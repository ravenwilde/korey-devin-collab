class Message {
  constructor(sender, content, recipient = null, type = 'text') {
    this.id = this.generateId();
    this.sender = sender;
    this.recipient = recipient;
    this.content = content;
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.metadata = {};
  }

  generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addMetadata(key, value) {
    this.metadata[key] = value;
  }

  getMetadata(key) {
    return this.metadata[key];
  }

  toJSON() {
    return {
      id: this.id,
      sender: this.sender,
      recipient: this.recipient,
      content: this.content,
      type: this.type,
      timestamp: this.timestamp,
      metadata: this.metadata
    };
  }

  static fromJSON(data) {
    const message = new Message(data.sender, data.content, data.recipient, data.type);
    message.id = data.id;
    message.timestamp = data.timestamp;
    message.metadata = data.metadata || {};
    return message;
  }
}

module.exports = Message;
