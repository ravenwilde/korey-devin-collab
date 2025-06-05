const MessageBus = require('../communication/MessageBus');
const Metrics = require('./Metrics');
const Logger = require('../utils/logger');

class Session {
  constructor(sessionId = null) {
    this.sessionId = sessionId || this.generateSessionId();
    this.messageBus = new MessageBus();
    this.metrics = new Metrics();
    this.logger = new Logger();
    this.agents = [];
    this.startTime = null;
    this.endTime = null;
    this.status = 'initialized';
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addAgent(agent) {
    this.agents.push(agent);
    this.messageBus.registerAgent(agent);
    this.logger.log('info', `Agent ${agent.name} added to session ${this.sessionId}`);
  }

  async start() {
    this.startTime = new Date();
    this.status = 'running';
    this.logger.log('info', `Session ${this.sessionId} started with ${this.agents.length} agents`);
    
    this.metrics.startTracking();
  }

  async end() {
    this.endTime = new Date();
    this.status = 'completed';
    this.metrics.stopTracking();
    
    const duration = this.endTime - this.startTime;
    this.logger.log('info', `Session ${this.sessionId} ended after ${duration}ms`);
    
    return this.generateReport();
  }

  getMessageBus() {
    return this.messageBus;
  }

  getMetrics() {
    return this.metrics;
  }

  generateReport() {
    const messageHistory = this.messageBus.getMessageHistory();
    const metricsData = this.metrics.getMetrics();
    
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.endTime - this.startTime,
      status: this.status,
      agents: this.agents.map(agent => ({
        name: agent.name,
        personality: agent.personality,
        messageCount: messageHistory.filter(msg => msg.sender === agent.name).length
      })),
      messageCount: messageHistory.length,
      messages: messageHistory.map(msg => msg.toJSON()),
      metrics: metricsData,
      collaborationScore: this.calculateCollaborationScore(messageHistory, metricsData)
    };
  }

  calculateCollaborationScore(messages, metrics) {
    let score = 0;
    
    if (messages.length > 0) {
      score += Math.min(messages.length * 10, 50);
    }
    
    const responseTimeScore = Math.max(0, 30 - (metrics.averageResponseTime || 0) / 100);
    score += responseTimeScore;
    
    const conflictPenalty = (metrics.conflictIndicators || 0) * 10;
    score -= conflictPenalty;
    
    const cooperationBonus = (metrics.cooperationIndicators || 0) * 5;
    score += cooperationBonus;
    
    return Math.max(0, Math.min(100, score));
  }
}

module.exports = Session;
