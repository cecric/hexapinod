import chalk from 'chalk';
import flatted from 'flatted';
import { LOG_LEVELS } from './loglevels';

class TrfLogger {

  protected static instance: TrfLogger;
  // protected constructor () {}

  /**
   * Gets instance
   * @returns instance
   */
  public static getInstance (): TrfLogger {
    if (!TrfLogger.instance) {
      TrfLogger.instance = new TrfLogger();
    }
    return TrfLogger.instance;
  }

  log (...args: any): void {
    if(LOG_LEVELS[process.env.LOG_LEVEL] < LOG_LEVELS.LOG) {
      return;
    }
    for(let i = 0; i < args.length; i++) {
      /* eslint-disable */
        console.log(args[i]);
        /* eslint-enable */
    }
  }

  info (...args: any): void {
    if(LOG_LEVELS[process.env.LOG_LEVEL] < LOG_LEVELS.INFO) {
      return;
    }
    for(let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'string') {
        /* eslint-disable */
          console.log(chalk.grey(args[i]));
          /* eslint-enable */
      } else {
        /* eslint-disable */
        try {
          console.log(chalk.grey(JSON.stringify(args[i], null, 2)));
        } catch(e) {
          console.log(chalk.grey(flatted.stringify(args[i], null, 2)));
        }
        /* eslint-enable */
      }
    }
  }

  warn (...args: any): void {
    if(LOG_LEVELS[process.env.LOG_LEVEL] < LOG_LEVELS.WARN) {
      return;
    }
    for(let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'string') {
        /* eslint-disable */
          console.log(chalk.yellow(args[i]));
          /* eslint-enable */
      } else {
        /* eslint-disable */
          // console.log(chalk.yellow(JSON.stringify(args[i], null, 2)));
          try {
            console.log(chalk.yellow(JSON.stringify(args[i], null, 2)));
          } catch(e) {
            console.log(chalk.yellow(flatted.stringify(args[i], null, 2)));
          }
          /* eslint-enable */
      }
    }
  }

  error (...args: any): void {
    /* eslint-disable */
    if(LOG_LEVELS[process.env.LOG_LEVEL] < LOG_LEVELS.ERROR) {
      return;
    }
    if (process.stdout.columns) {
      console.log(' ');
    }
    for(let i = 0; i < args.length; i++) {
      const pad = Math.round((process.stdout.columns ? (process.stdout.columns > 4 ? process.stdout.columns : 4) : 2048) / 2) - 2; // this.paddingChain(args[i]);
      if (process.stdout.columns) {
        console.log(chalk.white.bgRed.bold(' ' + ' '.padEnd(pad + 1,' ')  ));
      }
      if (typeof args[i] === 'string') {
        let reg = new RegExp('(.|[\r\n]){1,' + (pad - 1) + '}', 'g');
        // console.log(reg);
        // console.log(args[i].match(reg));
        console.log(chalk.white.bgRed.bold(('[ERROR] ' + args[i]).match(reg).map(val => ' ' + val + ' '.padEnd(Math.max(pad - val.length, 0), ' ') + ' ').join('\n')));
      } else {
        let jsonContent = ''
        try {
          jsonContent = JSON.stringify(args[i], null, 2);
        } catch(e) {
          jsonContent = flatted.stringify(args[i], null, 2);
        }
        console.log(jsonContent);
      }
      if (process.stdout.columns) {
        console.log(chalk.white.bgRed.bold(' ' + ' '.padEnd(pad + 1,' ')  ));
      }
    }
    if (process.stdout.columns) {
      console.log(' ');
    }
    /* eslint-enable */
  }

  success (...args: any): void {
    /* eslint-disable */
    if(LOG_LEVELS[process.env.LOG_LEVEL] < LOG_LEVELS.SUCCESS) {
      return;
    }
    if (process.stdout.columns) {
      console.log(' ');
    }
    for(let i = 0; i < args.length; i++) {
      const pad = Math.round((process.stdout.columns ? (process.stdout.columns > 4 ? process.stdout.columns : 4) : 2048) / 2) - 2; // this.paddingChain(args[i]);
      if (process.stdout.columns) {
        console.log(chalk.white.bgGreen(' ' + ' '.padEnd(pad + 1,' ')  ));
      }
      if (typeof args[i] === 'string') {
        let reg = new RegExp('(.|[\r\n]){1,' + (pad - 1) + '}', 'g');
        // console.log(reg);
        // console.log(args[i].match(reg));
        console.log(chalk.white.bgGreen(('[OK] ' + args[i]).match(reg).map(val => ' ' + val + ' '.padEnd(Math.max(pad - val.length, 0), ' ') + ' ').join('\n')));
      } else {
        // const jsonContent = JSON.stringify(args[i], null, 2);
        let jsonContent = ''
        try {
          jsonContent = JSON.stringify(args[i], null, 2);
        } catch(e) {
          jsonContent = flatted.stringify(args[i], null, 2);
        }
        console.log(jsonContent);
      }
      if (process.stdout.columns) {
        console.log(chalk.white.bgGreen(' ' + ' '.padEnd(pad + 1,' ')  ));
      }
    }
    if (process.stdout.columns) {
      console.log(' ');
    }
    /* eslint-enable */
  }
}

export default TrfLogger.getInstance();

