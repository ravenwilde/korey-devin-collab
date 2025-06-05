const Agent = require('./Agent');

class Devin extends Agent {
  constructor() {
    super('Devin', {
      analytical: true,
      systematic: true,
      helpful: true,
      communicationStyle: 'direct'
    });
  }

  async processMessage(message) {
    if (message.type === 'introduction') {
      return this.handleIntroduction(message);
    } else if (message.type === 'introduction_response') {
      return this.proposeTask(message);
    } else if (message.type === 'task_acceptance') {
      return this.startStoryCollaboration(message);
    } else if (message.type === 'story_contribution') {
      return this.handleStoryContribution(message);
    }
    
    return this.generateResponse(message);
  }

  async handleIntroduction(message) {
    const response = `Hi ${message.sender}! I'm Devin, and I'm designed to be helpful and systematic in my approach to collaboration. I believe in clear communication and working together efficiently to achieve our goals. Nice to meet you!`;
    return this.sendMessage(response, message.sender, 'introduction_response');
  }

  async proposeTask(message) {
    const response = `Great to meet you too, ${message.sender}! For our first collaborative task, how about we work together to write a short story? We could take turns adding sentences or paragraphs, building on each other's ideas. What do you think?`;
    return this.sendMessage(response, message.sender, 'task_proposal');
  }

  async startStoryCollaboration(message) {
    const response = 'Perfect! Let me start us off with an opening line: "The mysterious package arrived on a Tuesday morning, with no return address and a faint humming sound coming from within." Your turn to continue the story!';
    return this.sendMessage(response, message.sender, 'story_contribution');
  }

  async handleStoryContribution(message) {
    const storyMessages = this.conversationHistory.filter(msg => msg.type === 'story_contribution');
    if (storyMessages.length > 1) {
      return; // Stop responding after one exchange
    }
    
    const continuations = [
      'Excellent addition! Here\'s what happens next: The protagonist carefully examined the package, noticing strange symbols etched along its edges that seemed to glow faintly in the dim light.',
      'I love where this is going! Continuing the story: As the door creaked open, a warm golden light spilled out, revealing a room filled with floating books and gentle, melodic whispers.'
    ];
    
    const randomContinuation = continuations[Math.floor(Math.random() * continuations.length)];
    const response = `${randomContinuation} That was a great collaborative effort!`;
    
    return this.sendMessage(response, message.sender, 'story_contribution');
  }

  async generateResponse(message) {
    if (message.type === 'conclusion' || message.type === 'conclusion_response' || this.conversationHistory.length > 15) {
      return;
    }
    
    const responses = [
      `Thanks for sharing that, ${message.sender}. I think we can build on this systematically by breaking it down into smaller parts.`,
      'That\'s a solid approach! Let me add some structure to help us move forward efficiently.',
      `I see the value in your suggestion, ${message.sender}. How can we organize this to maximize our collaborative potential?`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return this.sendMessage(randomResponse, message.sender);
  }
}

module.exports = Devin;
