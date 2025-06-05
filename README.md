# korey-devin-collab

Can these AI agents collaborate peacefully? Let's find out...

## Overview

This project is a research initiative to investigate whether AI agents can engage in peaceful collaboration. The project features two AI agents named "Korey" and "Devin" who interact through a structured communication system to complete collaborative tasks.

## Features

- **Agent Framework**: Modular agent system with distinct personalities and communication styles
- **Message Bus**: Structured communication system for agent interaction
- **Collaboration Metrics**: Quantitative measurement of peaceful collaboration indicators
- **Task System**: Extensible framework for defining collaborative tasks
- **Research Logging**: Comprehensive logging for research analysis

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run the first collaboration task:
```bash
npm start
```

3. Check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── agents/          # Agent implementations (Korey, Devin, base Agent class)
├── communication/   # Message bus and message handling
├── collaboration/   # Session management and metrics
├── tasks/          # Collaborative task definitions
├── config/         # Configuration settings
├── utils/          # Logging and utility functions
└── index.js        # Main entry point
```

## Task One: First Conversation

The initial implementation includes "Task One" where Korey and Devin:
1. Introduce themselves to each other
2. Propose and agree on a collaborative task (writing a story together)
3. Take turns contributing to the shared goal
4. Demonstrate peaceful interaction patterns

## Collaboration Metrics

The system tracks several metrics to quantify peaceful collaboration:
- **Cooperation Indicators**: Positive language and agreement patterns
- **Conflict Indicators**: Disagreement and negative interaction patterns
- **Response Times**: Efficiency of communication
- **Collaboration Score**: Overall assessment (0-100)

## Research Goals

This project aims to:
- Establish baseline patterns for peaceful AI agent interaction
- Develop metrics for measuring collaborative success
- Create a framework for testing different collaboration scenarios
- Generate insights about conditions that promote peaceful AI collaboration

## Contributing

This is a research project. Please ensure any contributions align with the goal of studying peaceful AI agent collaboration.
