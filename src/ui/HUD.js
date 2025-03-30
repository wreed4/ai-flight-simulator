export class {
  init() {
    this.debug = false;
    this.debugLevel = "info";
    this.logs = [];
  },

  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
    };

    this.logs.push(logEntry);

    if (this.debug) {
      console.log(`[${timestamp}] [${level}] ${message}`);
    }
  },

  error(message) {
    this.log(message, "error");
  },

  warn(message) {
    this.log(message, "warn");
  },

  info(message) {
    this.log(message, "info");
  },

  debug(message) {
    this.log(message, "debug");
  },

  getLogs() {
    return this.logs;
  },

  clearLogs() {
    this.logs = [];
  },

  setDebug(enabled) {
    this.debug = enabled;
  },

  setDebugLevel(level) {
    this.debugLevel = level;
  },
};
