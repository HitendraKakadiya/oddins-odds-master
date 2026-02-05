/**
 * Simple structured logger for worker jobs
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  job?: string;
  [key: string]: unknown;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...this.context,
      ...meta,
    };

    const output = JSON.stringify(logEntry);

    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>) {
    const errorMeta = error instanceof Error 
      ? { error: error.message, stack: error.stack }
      : { error };
    this.log('error', message, { ...errorMeta, ...meta });
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();

