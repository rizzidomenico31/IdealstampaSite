const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = levels[process.env.LOG_LEVEL] ?? levels.info;

const ts = () => new Date().toISOString();

const write = (level, icon, args) => {
    if (levels[level] > currentLevel) return;
    const stream = level === 'error' ? console.error : console.log;
    stream(`${icon} [${ts()}] [${level.toUpperCase()}]`, ...args);
};

module.exports = {
    info: (...args) => write('info', 'ℹ️ ', args),
    warn: (...args) => write('warn', '⚠️ ', args),
    error: (...args) => write('error', '❌', args),
    debug: (...args) => write('debug', '🔍', args),
    success: (...args) => write('info', '✅', args)
};
