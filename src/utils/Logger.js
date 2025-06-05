class Logger {
  constructor(context = 'Application') {
    this.context = context;
    this.logs = [];
    this.enableConsole = true;
  }

  log(level, data) {
    const logEntry = {
      timestamp: new Date(),
      level: level,
      context: this.context,
      data: data
    };

    this.logs.push(logEntry);

    if (this.enableConsole) {
      this.outputToConsole(logEntry);
    }
  }

  outputToConsole(logEntry) {
    const timestamp = logEntry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${logEntry.context}] [${logEntry.level}]`;

    switch (logEntry.level) {
    case 'ERROR':
      console.error(prefix, logEntry.data);
      break;
    case 'WARN':
      console.warn(prefix, logEntry.data);
      break;
    case 'INFO':
      console.info(prefix, logEntry.data);
      break;
    default:
      console.log(prefix, logEntry.data);
    }
  }

  info(data) {
    this.log('INFO', data);
  }

  warn(data) {
    this.log('WARN', data);
  }

  error(data) {
    this.log('ERROR', data);
  }

  debug(data) {
    this.log('DEBUG', data);
  }

  getLogs() {
    return [...this.logs];
  }

  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }

  setConsoleOutput(enabled) {
    this.enableConsole = enabled;
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

module.exports = Logger;
