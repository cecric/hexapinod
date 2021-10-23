import chalk from 'chalk';
import flatted from 'flatted';


/**
 * List of level of logs used to define the severity of the writed log.
 * @date 20/10/2021 - 22:36:00
 * @author cecric
 *
 * @export
 * @enum {number}
 */
export enum LOG_LEVELS {
  'ERROR' = 0,
  'WARN' = 1,
  'SUCCESS' = 2,
  'INFO' = 3,
  'LOG' = 4
}

/**
 * manage logs writing and style
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @class LoggerTool
 * @typedef {LoggerTool}
 */
class LoggerTool {


  /**
   * The instance of the singleton
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @static
   * @type {LoggerTool}
   */
  protected static instance: LoggerTool;
  // protected constructor () {}

  /**
   * Gets instance
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @returns instance
   */
  public static getInstance (): LoggerTool {
    if (!LoggerTool.instance) {
      LoggerTool.instance = new LoggerTool();
    }
    return LoggerTool.instance;
  }


  /**
   * log with the basic log level
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {...unknown[]} args
   */
  log (...args: unknown[]): void {
    if(LOG_LEVELS[process.env.LOG_LEVEL] < LOG_LEVELS.LOG) {
      return;
    }
    for(let i = 0; i < args.length; i++) {
      /* eslint-disable */
        console.log(args[i]);
        /* eslint-enable */
    }
  }

  /**
   * Write an information log
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {...unknown[]} args
   */
  info (...args: unknown[]): void {
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

  /**
   * Write a warn log
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {...unknown[]} args
   */
  warn (...args: unknown[]): void {
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

  /**
   * Write an error log
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {...unknown[]} args
   */
  error (...args: unknown[]): void {
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
        const splittedJson = jsonContent.split('\n');
        for (let i = 0; i < splittedJson.length; i++) {
          splittedJson[i] = splittedJson[i].padEnd(pad + 2, ' ');
        }
        jsonContent =  splittedJson.join('\n');
        console.log(chalk.black.bgRedBright(jsonContent));
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

  /**
   * Write a success log
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {...unknown[]} args
   */
  success (...args: unknown[]): void {
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
        console.log(chalk.whiteBright.bgGreen(' ' + ' '.padEnd(pad + 1,' ')  ));
      }
      if (typeof args[i] === 'string') {
        let reg = new RegExp('(.|[\r\n]){1,' + (pad - 1) + '}', 'g');
        // console.log(reg);
        // console.log(args[i].match(reg));
        console.log(chalk.whiteBright.bgGreen(('[OK] ' + args[i]).match(reg).map(val => ' ' + val + ' '.padEnd(Math.max(pad - val.length, 0), ' ') + ' ').join('\n')));
      } else {
        // const jsonContent = JSON.stringify(args[i], null, 2);
        let jsonContent = ''
        try {
          jsonContent = JSON.stringify(args[i], null, 2);
        } catch(e) {
          jsonContent = flatted.stringify(args[i], null, 2);
        }
        const splittedJson = jsonContent.split('\n');
        for (let i = 0; i < splittedJson.length; i++) {
          splittedJson[i] = splittedJson[i].padEnd(pad + 2, ' ');
        }
        jsonContent =  splittedJson.join('\n');
        console.log(chalk.black.bgGreenBright(jsonContent));
      }
      if (process.stdout.columns) {
        console.log(chalk.whiteBright.bgGreen(' ' + ' '.padEnd(pad + 1,' ')  ));
      }
    }
    if (process.stdout.columns) {
      console.log(' ');
    }
    /* eslint-enable */
  }
}

export type { LoggerTool };

/**
 * Instance of logger
 * @date 20/10/2021 - 10:47:30
 * @author cecric
 *
 * @type {LoggerTool}
 */
export const logger = LoggerTool.getInstance();

