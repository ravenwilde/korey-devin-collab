const Agent = require('./Agent');

class Korey extends Agent {
  constructor() {
    super('Korey', {
      collaborative: true,
      patient: true,
      creative: true,
      communicationStyle: 'thoughtful'
    });
  }

  async processMessage(message) {
    if (message.type === 'introduction') {
      return this.handleIntroduction(message);
    } else if (message.type === 'task_proposal') {
      return this.handleTaskProposal(message);
    } else if (message.type === 'story_contribution') {
      return this.handleStoryContribution(message);
    } else if (message.type === 'conclusion') {
      return this.handleConclusion(message);
    }
    
    return this.generateResponse(message);
  }

  async handleIntroduction(message) {
    const response = `Hello ${message.sender}! I'm Korey, and I'm excited to collaborate with you. I believe in thoughtful communication and creative problem-solving. I'm looking forward to working together peacefully and productively.`;
    return this.sendMessage(response, message.sender, 'introduction_response');
  }

  async handleTaskProposal(message) {
    const response = 'That sounds like a wonderful idea! I\'d love to collaborate on writing a story together. I think we can create something really interesting by combining our different perspectives. Should we start by deciding on a theme or setting?';
    return this.sendMessage(response, message.sender, 'task_acceptance');
  }

  async handleStoryContribution(message) {
    const storyMessages = this.conversationHistory.filter(msg => msg.type === 'story_contribution');
    if (storyMessages.length > 2) {
      return; // Stop responding after a few exchanges
    }
    
    const storyContributions = [
      'The old lighthouse stood majestically on the cliff, its beacon cutting through the morning mist as Sarah approached the weathered door.',
      'As the spaceship\'s engines hummed to life, Captain Chen looked out at the vast expanse of stars, knowing this mission would change everything.',
      'In the heart of the enchanted forest, where ancient trees whispered secrets, a small cottage appeared through the dappled sunlight.'
    ];
    
    const randomContribution = storyContributions[Math.floor(Math.random() * storyContributions.length)];
    const response = `Building on your contribution: ${randomContribution} What happens next?`;
    
    return this.sendMessage(response, message.sender, 'story_contribution');
  }

  async handleConclusion(message) {
    const response = `Thank you too, ${message.sender}! This was indeed a wonderful demonstration of peaceful collaboration. I enjoyed working together on our creative story. Looking forward to more collaborative adventures!`;
    return this.sendMessage(response, message.sender, 'conclusion_response');
  }

  async generateResponse(message) {
    if (message.type === 'conclusion' || message.type === 'conclusion_response' || this.conversationHistory.length > 15) {
      return;
    }
    
    const responses = [
      `I appreciate your perspective on that, ${message.sender}. Let me think about how we can build on this idea together.`,
      'That\'s an interesting point! I\'d like to add that we could approach this collaboratively by considering multiple viewpoints.',
      `I hear what you're saying, ${message.sender}. How can we work together to make this even better?`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return this.sendMessage(randomResponse, message.sender);
  }
}

module.exports = Korey;
