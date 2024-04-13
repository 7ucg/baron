const cluster = require('cluster');
const os = require('os');
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const Readline = require('readline');
const { spawn } = require('child_process');
const CFonts = require('cfonts');
const Winston = require('winston');

// Konfiguration des Loggers
const logger = Winston.createLogger({
  level: 'info',
  format: Winston.format.combine(
    Winston.format.timestamp(),
    Winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new Winston.transports.Console(),
    new Winston.transports.File({ filename: 'server.log' })
  ]
});

CFonts.say('Bot', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
});

CFonts.say("Bot Original von Baron", {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
});

const numCPUs = os.cpus().length;
let isRunning = false;

/**
 * Startet eine JavaScript-Datei
 * @param {String} file Pfad/zu/Datei
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [path.join(__dirname, file), ...process.argv.slice(2)];
  logger.info(`Starting process: ${[process.argv[0], ...args].join(' ')}`);

  cluster.setupMaster({
    exec: path.join(__dirname, file),
    args: args.slice(1),
  });

  const worker = cluster.fork();

  worker.on('message', data => {
    logger.info(`[RECEIVED] ${data}`);
    switch (data) {
      case 'reset':
        worker.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case 'uptime':
        worker.send(process.uptime());
        break;
    }
  });

  worker.on('exit', code => {
    worker.kill();
    isRunning = false;
    start.apply(this, arguments);
    isRunning = false;
    logger.error(`Exited with code: ${code}`);
    if (code !== 0) {
      fs.watchFile(args[0], () => {
        fs.unwatchFile(args[0]);
        start(file);
      });
    }
  });

  const opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  if (!opts['test']) {
    const rl = Readline.createInterface(process.stdin, process.stdout);
    if (rl && rl.listenerCount() === 0) {
      rl.on('line', line => {
        worker.emit('message', line.trim());
      });
    }
  }
}

start('server.js');
