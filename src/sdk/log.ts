// Structured JSON logging to stderr
// Compatible with: ELK Stack, Datadog, CloudWatch, Splunk, Grafana Loki

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  msg: string;
  ts: string;
  [key: string]: unknown;
}

function write(entry: LogEntry): void {
  // In WASI, console.error writes to stderr
  console.error(JSON.stringify(entry));
}

function now(): string {
  return new Date().toISOString();
}

function createLogFn(level: LogLevel) {
  return (message: string, fields?: Record<string, unknown>): void => {
    write({
      level,
      msg: message,
      ts: now(),
      ...fields,
    });
  };
}

export const log = {
  debug: createLogFn("debug"),
  info: createLogFn("info"),
  warn: createLogFn("warn"),
  error: createLogFn("error"),
};
