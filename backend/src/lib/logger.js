// Tiny leveled logger. Set LOG_LEVEL=error|warn|info|debug (default: info).
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const threshold = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;

const useColor = process.stdout.isTTY;
const COLORS = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m', debug: '\x1b[90m', reset: '\x1b[0m' };

function paint(level, text) {
  return useColor ? `${COLORS[level]}${text}${COLORS.reset}` : text;
}

function write(level, ...args) {
  if (LEVELS[level] > threshold) return;
  const time = new Date().toISOString().slice(11, 19); // HH:MM:SS
  const tag = paint(level, level.toUpperCase().padEnd(5));
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  sink(`${time} ${tag}`, ...args);
}

export const log = {
  error: (...a) => write('error', ...a),
  warn:  (...a) => write('warn', ...a),
  info:  (...a) => write('info', ...a),
  debug: (...a) => write('debug', ...a),
};

// Express middleware: one tidy line per request, level by status code.
export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    write(level, `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}
