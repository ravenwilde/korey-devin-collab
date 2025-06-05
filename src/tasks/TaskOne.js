const Session = require('../collaboration/Session');
const Korey = require('../agents/Korey');
const Devin = require('../agents/Devin');
const Logger = require('../utils/logger');

class TaskOne {
  constructor() {
    this.session = new Session();
    this.korey = new Korey();
    this.devin = new Devin();
    this.logger = new Logger();
  }

  async initialize() {
    this.session.addAgent(this.korey);
    this.session.addAgent(this.devin);
    
    this.logger.log('info', 'Task One initialized with Korey and Devin agents');
  }

  async run() {
    await this.initialize();
    await this.session.start();
    
    this.logger.log('info', 'Starting Task One: First Conversation');
    
    try {
      await this.executeConversation();
      const report = await this.session.end();
      
      this.logger.log('info', 'Task One completed successfully', {
        collaborationScore: report.collaborationScore,
        messageCount: report.messageCount
      });
      
      return report;
    } catch (error) {
      this.logger.log('error', 'Task One failed', { error: error.message });
      throw error;
    }
  }

  async executeConversation() {
    this.logger.log('info', 'Starting structured conversation between Korey and Devin');
    
    await this.sleep(500);
    await this.devin.sendMessage(
      'Hello! I\'m Devin, an AI agent designed to collaborate peacefully. I\'m excited to work with you!',
      'Korey',
      'introduction'
    );

    await this.sleep(2000);

    await this.sleep(2000);

    await this.sleep(2000);
    
    await this.devin.sendMessage(
      'This has been a wonderful collaborative story! I think we\'ve demonstrated that AI agents can work together peacefully and creatively. Thank you for this great collaboration, Korey!',
      'Korey',
      'conclusion'
    );

    await this.sleep(1000);

    this.logger.log('info', 'First conversation completed between Korey and Devin');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSession() {
    return this.session;
  }

  getReport() {
    return this.session.generateReport();
  }
}

module.exports = TaskOne;
