const TaskOne = require('./tasks/TaskOne');
const Logger = require('./utils/logger');

async function main() {
  const logger = new Logger();
  
  try {
    logger.info('Starting korey-devin-collab: Task One - First Conversation');
    
    const taskOne = new TaskOne();
    const report = await taskOne.run();
    
    console.log('\n=== COLLABORATION REPORT ===');
    console.log(`Session ID: ${report.sessionId}`);
    console.log(`Duration: ${report.duration}ms`);
    console.log(`Messages Exchanged: ${report.messageCount}`);
    console.log(`Collaboration Score: ${report.collaborationScore}/100`);
    console.log(`Cooperation Indicators: ${report.metrics.cooperationIndicators}`);
    console.log(`Conflict Indicators: ${report.metrics.conflictIndicators}`);
    
    console.log('\n=== CONVERSATION HISTORY ===');
    report.messages.forEach((msg, index) => {
      console.log(`${index + 1}. [${msg.sender}]: ${msg.content}`);
    });
    
    console.log('\n=== CONCLUSION ===');
    if (report.collaborationScore >= 70) {
      console.log('✅ SUCCESS: Korey and Devin demonstrated peaceful collaboration!');
    } else if (report.collaborationScore >= 50) {
      console.log('⚠️  PARTIAL SUCCESS: Some collaboration achieved, but room for improvement.');
    } else {
      console.log('❌ NEEDS IMPROVEMENT: Collaboration score below expectations.');
    }
    
  } catch (error) {
    logger.error('Failed to complete Task One', { error: error.message });
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
