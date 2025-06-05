const MessageBus = require('../communication/MessageBus');
const Logger = require('../utils/Logger');

class CollaborationEnvironment {
  constructor(config = {}) {
    this.messageBus = new MessageBus();
    this.logger = new Logger('CollaborationEnvironment');
    this.agents = [];
    this.currentTask = null;
    this.sessionId = this.generateSessionId();
    this.startTime = null;
    this.endTime = null;
    this.config = {
      maxDuration: config.maxDuration || 300000, // 5 minutes default
      maxMessages: config.maxMessages || 100,
      enableLogging: config.enableLogging !== false
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.messageBus.on('messageSent', (message) => {
      if (this.config.enableLogging) {
        this.logger.log('MESSAGE_SENT', message);
      }
      this.checkTerminationConditions();
    });

    this.messageBus.on('deliveryFailed', (event) => {
      this.logger.log('DELIVERY_FAILED', event);
    });

    this.messageBus.on('agentRegistered', (event) => {
      this.logger.log('AGENT_REGISTERED', event);
    });
  }

  addAgent(agent) {
    if (!agent) {
      throw new Error('Agent cannot be null or undefined');
    }

    this.agents.push(agent);
    this.messageBus.registerAgent(agent);

    this.logger.log('AGENT_ADDED', {
      agentName: agent.name,
      agentId: agent.id,
      sessionId: this.sessionId
    });
  }

  removeAgent(agentName) {
    this.agents = this.agents.filter(agent => agent.name !== agentName);
    this.messageBus.unregisterAgent(agentName);

    this.logger.log('AGENT_REMOVED', {
      agentName: agentName,
      sessionId: this.sessionId
    });
  }

  startCollaboration(task = null) {
    if (this.agents.length < 2) {
      throw new Error('At least 2 agents required for collaboration');
    }

    this.currentTask = task;
    this.startTime = new Date();
    this.messageBus.start();

    this.logger.log('COLLABORATION_STARTED', {
      sessionId: this.sessionId,
      task: task,
      agentCount: this.agents.length,
      startTime: this.startTime
    });

    this.initiateConversation();
  }

  initiateConversation() {
    if (this.agents.length >= 2) {
      const firstAgent = this.agents[0];
      const secondAgent = this.agents[1];

      const greetingMessage = {
        type: 'greeting',
        content: `Hello! I'm ${firstAgent.name}. I'm excited to collaborate with you on our task.`,
        from: firstAgent.name,
        to: secondAgent.name,
        timestamp: new Date()
      };

      setTimeout(() => {
        this.messageBus.sendMessage(greetingMessage);
      }, 1000);
    }
  }

  stopCollaboration() {
    this.endTime = new Date();
    this.messageBus.stop();

    this.logger.log('COLLABORATION_ENDED', {
      sessionId: this.sessionId,
      duration: this.endTime - this.startTime,
      endTime: this.endTime
    });
  }

  checkTerminationConditions() {
    const stats = this.messageBus.getStats();
    const currentTime = new Date();
    const duration = currentTime - this.startTime;

    if (duration > this.config.maxDuration) {
      this.logger.log('TERMINATION', { reason: 'MAX_DURATION_REACHED', duration });
      this.stopCollaboration();
      return true;
    }

    if (stats.totalMessages >= this.config.maxMessages) {
      this.logger.log('TERMINATION', { reason: 'MAX_MESSAGES_REACHED', messageCount: stats.totalMessages });
      this.stopCollaboration();
      return true;
    }

    return false;
  }

  sendTaskProposal(fromAgent, taskDescription) {
    const proposal = {
      type: 'proposal',
      content: taskDescription,
      from: fromAgent,
      timestamp: new Date()
    };

    this.messageBus.sendMessage(proposal);
  }

  getCollaborationSummary() {
    const messageHistory = this.messageBus.getMessageHistory();
    const stats = this.messageBus.getStats();

    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.endTime ? this.endTime - this.startTime : null,
      agents: this.agents.map(agent => ({
        name: agent.name,
        id: agent.id,
        collaborationScore: agent.getCollaborationScore()
      })),
      messageStats: stats,
      messageHistory: messageHistory,
      task: this.currentTask
    };
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isActive() {
    return this.messageBus.isActive;
  }

  getAgents() {
    return this.agents;
  }

  getCurrentTask() {
    return this.currentTask;
  }
}

module.exports = CollaborationEnvironment;
