const CollaborationEnvironment = require('../environment/CollaborationEnvironment');
const CollaborationMetrics = require('../assessment/CollaborationMetrics');
const KoreyAgent = require('../agents/KoreyAgent');
const DevinAgent = require('../agents/DevinAgent');

class TaskOneConversation {
  constructor(config = {}) {
    this.environment = new CollaborationEnvironment(config);
    this.metrics = new CollaborationMetrics();
    this.korey = new KoreyAgent();
    this.devin = new DevinAgent();
    this.taskDescription = config.taskDescription || 'planning a collaborative project together';
  }

  async runConversation() {
    console.log('🤖 Starting Task One Conversation: AI Agent Collaboration Experiment');
    console.log('=' .repeat(70));

    this.environment.addAgent(this.korey);
    this.environment.addAgent(this.devin);

    this.environment.startCollaboration(this.taskDescription);

    await this.simulateConversationFlow();

    this.environment.stopCollaboration();
    const summary = this.environment.getCollaborationSummary();
    const report = this.metrics.analyzeCollaboration(summary);

    return {
      summary: summary,
      report: report
    };
  }

  async simulateConversationFlow() {
    return new Promise((resolve) => {
      let messageCount = 0;
      const maxMessages = 12;

      this.environment.messageBus.on('messageSent', (_message) => {
        messageCount++;

        if (messageCount === 2) {
          setTimeout(() => {
            const taskProposal = this.korey.generateProposal(this.taskDescription);
            taskProposal.to = this.devin.name;
            this.environment.messageBus.sendMessage(taskProposal);
          }, 2000);
        }

        if (messageCount === 5) {
          setTimeout(() => {
            const counterProposal = this.devin.generateProposal('creating an innovative solution with both analytical and creative elements');
            counterProposal.to = this.korey.name;
            this.environment.messageBus.sendMessage(counterProposal);
          }, 2000);
        }

        if (messageCount >= maxMessages) {
          setTimeout(() => {
            resolve();
          }, 1000);
        }
      });

      setTimeout(() => {
        resolve();
      }, 30000);
    });
  }

  displayResults(results) {
    console.log('\n📊 COLLABORATION RESULTS');
    console.log('=' .repeat(70));

    const { summary, report } = results;

    console.log(`Session ID: ${summary.sessionId}`);
    console.log(`Duration: ${summary.duration}ms`);
    console.log(`Total Messages: ${summary.messageStats.totalMessages}`);
    console.log(`Participants: ${summary.agents.map(a => a.name).join(', ')}`);

    console.log('\n🎯 ASSESSMENT');
    console.log('-' .repeat(40));
    console.log(`Overall Rating: ${report.assessment.overallRating}`);
    console.log(`Overall Score: ${report.assessment.overallScore}/100`);
    console.log(`Peaceful Collaboration: ${report.assessment.peacefulCollaboration ? '✅ Yes' : '❌ No'}`);
    console.log(`Successful Interaction: ${report.assessment.successfulInteraction ? '✅ Yes' : '❌ No'}`);

    console.log('\n📈 METRICS');
    console.log('-' .repeat(40));
    console.log(`Communication Quality: ${Math.round(report.metrics.communicationQuality)}/100`);
    console.log(`Collaboration Effectiveness: ${Math.round(report.metrics.collaborationEffectiveness)}/100`);
    console.log(`Peacefulness Score: ${Math.round(report.metrics.peacefulnessScore)}/100`);
    console.log(`Successful Agreements: ${report.metrics.successfulAgreements}`);
    console.log(`Conflict Resolutions: ${report.metrics.conflictResolutions}`);

    if (report.assessment.strengths.length > 0) {
      console.log('\n💪 STRENGTHS');
      console.log('-' .repeat(40));
      report.assessment.strengths.forEach(strength => {
        console.log(`• ${strength}`);
      });
    }

    if (report.assessment.weaknesses.length > 0) {
      console.log('\n⚠️  AREAS FOR IMPROVEMENT');
      console.log('-' .repeat(40));
      report.assessment.weaknesses.forEach(weakness => {
        console.log(`• ${weakness}`);
      });
    }

    console.log('\n💡 RECOMMENDATIONS');
    console.log('-' .repeat(40));
    report.recommendations.forEach(rec => {
      console.log(`• ${rec}`);
    });

    console.log('\n💬 CONVERSATION HISTORY');
    console.log('-' .repeat(40));
    summary.messageHistory.forEach((msg, index) => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      console.log(`${index + 1}. [${time}] ${msg.from} → ${msg.to || 'ALL'}`);
      console.log(`   ${msg.type.toUpperCase()}: ${msg.content}`);
      console.log('');
    });
  }

  async runAndDisplay() {
    try {
      const results = await this.runConversation();
      this.displayResults(results);
      return results;
    } catch (error) {
      console.error('❌ Error running conversation:', error);
      throw error;
    }
  }
}

module.exports = TaskOneConversation;
