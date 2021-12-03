/**
 * Log helper
 */
class Logger {
  constructor(enableLog, loggingStrategy) {
    if (this.instance) {
      return this.instance;
    }
    this.loggingStrategy = loggingStrategy
      ? loggingStrategy
      : LOGGING_STRATEGY.DEFAULT;
    this.enableLog = enableLog;
    this.instance = this;
    this.logItems = [];
    this.onscreenDiv = null;

    if (LOGGING_STRATEGY.ONSCREEN === loggingStrategy) {
      this.onscreenDiv = document.createElement("div");
      this.onscreenDiv.id = "__onScreenLogging";
      this.onscreenDiv.style.zIndex = 9999999;
      this.onscreenDiv.style.position = "absolute";
      this.onscreenDiv.style.top = "0";
      this.onscreenDiv.style.left = "0";
      this.onscreenDiv.style.padding = "20px";
      this.onscreenDiv.style.backgroundColor = "#d8d8d8";
      this.onscreenDiv.style.backgroundColor = "rgba(216,216,216,0.8)";
      this.onscreenDiv.style.color = "#000000";
      this.onscreenDiv.style.lineHeight = "12px";
      this.onscreenDiv.style.fontSize = "12px";
      this.onscreenDiv.style.height = "366px";
      this.onscreenDiv.style.width = "60%";
      this.onscreenDiv.style.pointerEvents = "none";
      this.onscreenDiv.style.overflow = "hidden";
      document.body.appendChild(this.onscreenDiv);

      window.onerror = e => {
        const text = this.formatMessage("Error", e);
        this.onscreen(text);
      };
    }
  }

  formatMessage(module, message) {
    return "[" + module + "] " + message;
  }

  onscreen(text) {
    this.logItems.push(text);
    if (this.logItems.length > 15) {
      this.logItems.shift();
    }
    this.onscreenDiv.innerHTML = this.logItems.join("<hr />");
  }

  log(module, message) {
    if (this.enableLog) {
      const text = this.formatMessage(module, message);
      switch (this.loggingStrategy) {
        case LOGGING_STRATEGY.DEFAULT:
          console.log(text);
          break;
        case LOGGING_STRATEGY.ONSCREEN:
          this.onscreen(text);
          break;
        default:
          console.log(text);
      }
    }
  }

  error(module, message) {
    if (this.enableLog) {
      const text = this.formatMessage(module, message);
      console.error(text);
    }
  }

  warn(module, message) {
    if (this.enableLog) {
      const text = this.formatMessage(module, message);
      console.warn(text);
    }
  }

  trace(module, message) {
    if (this.enableLog) {
      const text = this.formatMessage(module, message);
      console.trace(text);
    }
  }

  info(module, message) {
    if (this.enableLog) {
      const text = this.formatMessage(module, message);
      console.info(text);
    }
  }
}

export const LOGGING_STRATEGY = {
  DEFAULT: 0,
  ONSCREEN: 1
};

const params = new URL(document.location).searchParams;
const debugging = params.get("allowlogging");
const strategy = params.get("loggingstrategy");
window.allowlogging = debugging !== null ? (debugging === "true" ? true : false) : false
export default new Logger(
  window.allowlogging,
  strategy !== null
    ? strategy === LOGGING_STRATEGY.ONSCREEN.toString()
      ? LOGGING_STRATEGY.ONSCREEN
      : LOGGING_STRATEGY.DEFAULT
    : LOGGING_STRATEGY.DEFAULT
);
