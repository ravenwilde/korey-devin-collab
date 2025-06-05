#!/usr/bin/env node

const TaskOneConversation = require('./scenarios/TaskOneConversation');
const fs = require('fs');
const path = require('path');

class KoreyDevinCollaboration {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '../config/agents.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.warn('⚠️  Could not load config file, using defaults');
      return {
        environment: {
          maxDuration: 300000,
          maxMessages: 100,
          enableLogging: true
        }
      };
    }
  }

  async runTaskOneConversation() {
    console.log('🚀 Korey-Devin Collaboration Experiment');
    console.log('Research Question: Can these AI agents collaborate peacefully?');
    console.log('');

    const scenario = new TaskOneConversation({
      taskDescription: 'planning a collaborative software project',
      ...this.config.environment
    });

    const results = await scenario.runAndDisplay();

    this.saveResults(results);

    return results;
  }

  saveResults(results) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `collaboration-results-${timestamp}.json`;
      const filepath = path.join(__dirname, '../results', filename);

      const resultsDir = path.dirname(filepath);
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }

      fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
      console.log(`\n💾 Results saved to: ${filename}`);
    } catch (error) {
      console.warn('⚠️  Could not save results:', error.message);
    }
  }

  async runInteractiveMode() {
    console.log('🎮 Interactive Mode - Coming Soon!');
    console.log('This will allow you to interact with the agents directly.');
  }

  displayHelp() {
    console.log('🤖 Korey-Devin Collaboration Tool');
    console.log('');
    console.log('Usage: npm start [command]');
    console.log('');
    console.log('Commands:');
    console.log('  conversation  Run the Task One conversation scenario (default)');
    console.log('  interactive   Run in interactive mode');
    console.log('  help         Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  npm start');
    console.log('  npm start conversation');
    console.log('  npm start interactive');
  }

  async run() {
    const command = process.argv[2] || 'conversation';

    try {
      switch (command) {
      case 'conversation':
        await this.runTaskOneConversation();
        break;
      case 'interactive':
        await this.runInteractiveMode();
        break;
      case 'help':
      case '--help':
      case '-h':
        this.displayHelp();
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        this.displayHelp();
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Application error:', error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const app = new KoreyDevinCollaboration();
  app.run();
}

module.exports = KoreyDevinCollaboration;
