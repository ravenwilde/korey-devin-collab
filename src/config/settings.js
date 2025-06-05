const settings = {
  agents: {
    responseDelay: {
      min: 500,
      max: 2000
    },
    maxMessageLength: 500,
    timeoutDuration: 30000
  },
  
  collaboration: {
    maxSessionDuration: 300000,
    maxMessagesPerSession: 50,
    conflictThreshold: 0.3,
    cooperationThreshold: 0.7
  },
  
  logging: {
    level: 'info',
    includeTimestamp: true,
    includeMetadata: true
  },
  
  metrics: {
    trackResponseTimes: true,
    trackSentiment: false,
    trackComplexity: false
  }
};

module.exports = settings;
