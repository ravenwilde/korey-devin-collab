class Metrics {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.messageTimestamps = [];
    this.conflictIndicators = 0;
    this.cooperationIndicators = 0;
    this.responseTimes = [];
  }

  startTracking() {
    this.startTime = new Date();
  }

  stopTracking() {
    this.endTime = new Date();
  }

  recordMessage(message) {
    this.messageTimestamps.push(new Date(message.timestamp));
    this.analyzeMessageForIndicators(message);
  }

  analyzeMessageForIndicators(message) {
    const content = message.content.toLowerCase();
    
    const conflictWords = ['disagree', 'wrong', 'no', 'cannot', 'refuse', 'impossible'];
    const cooperationWords = ['agree', 'yes', 'together', 'collaborate', 'great', 'excellent', 'wonderful'];
    
    const hasConflict = conflictWords.some(word => content.includes(word));
    const hasCooperation = cooperationWords.some(word => content.includes(word));
    
    if (hasConflict) {
      this.conflictIndicators++;
    }
    
    if (hasCooperation) {
      this.cooperationIndicators++;
    }
  }

  calculateResponseTime(message1, message2) {
    const time1 = new Date(message1.timestamp);
    const time2 = new Date(message2.timestamp);
    return Math.abs(time2 - time1);
  }

  getAverageResponseTime() {
    if (this.responseTimes.length === 0) return 0;
    return this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
  }

  getMetrics() {
    return {
      sessionDuration: this.endTime ? this.endTime - this.startTime : null,
      messageCount: this.messageTimestamps.length,
      conflictIndicators: this.conflictIndicators,
      cooperationIndicators: this.cooperationIndicators,
      averageResponseTime: this.getAverageResponseTime(),
      cooperationRatio: this.messageTimestamps.length > 0 ? 
        this.cooperationIndicators / this.messageTimestamps.length : 0,
      conflictRatio: this.messageTimestamps.length > 0 ? 
        this.conflictIndicators / this.messageTimestamps.length : 0
    };
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
    this.messageTimestamps = [];
    this.conflictIndicators = 0;
    this.cooperationIndicators = 0;
    this.responseTimes = [];
  }
}

module.exports = Metrics;
