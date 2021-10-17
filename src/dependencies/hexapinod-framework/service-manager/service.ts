// import { Worker } from 'worker_threads';

import terminal from '@dependencies/terminal/terminal';
import { fork } from 'child_process';

/**
 * Service base class, embed the mechanics for subprocess async launch.
 * @date 20/09/2021 - 08:00:00
 *
 * @export
 * @abstract
 * @class Service
 * @typedef {Service}
 */
export abstract class Service {

  /**
   * List of subprocesses launched
   * @date 20/09/2021 - 08:00:00
   *
   * @protected
   * @type {unknown}
   */
  protected subProcesses: unknown = {};

  /**
   * Tell if the service class is persistent or if a new one must be instanciend each time it is called by the service manager.
   * @date 20/09/2021 - 08:00:00
   *
   * @returns {boolean}
   */
  isPersistent (): boolean {
    return true;
  }

  /**
   * Initialization procedure for the service.
   * @date 20/09/2021 - 08:00:00
   *
   * @public
   * @returns {Promise<void>}
   */
  public initialization (): Promise<void>{
    // default do nothing
    return Promise.resolve();
  }

  /**
   * Function to override to be called by the subprocess
   * @date 20/09/2021 - 08:00:00
   *
   * @public
   * @param {unknown} _parameters
   * @returns {unknown}
   */
  public execInSubProcess (_parameters:unknown): unknown {
    terminal.log('sub process in service ' + this.constructor.name + ' called with parameters', _parameters);
    throw new Error('should be implemented');
    // return {'ok':true};
  }

  /**
   * Create a fork to launch a subprocess for the service
   * @date 20/09/2021 - 08:00:00
   *
   * @param {unknown} _parameters
   * @returns {Promise<unknown>}
   */
  fork (_parameters:unknown): Promise<unknown> {
    return new Promise((_resolve, _reject) => {
      let parameters = null;
      try {
        parameters = typeof _parameters === 'string' ? _parameters : JSON.stringify(_parameters);
      } catch (e) {
        _reject(e);
      }
      let forkedProcess = null;
      if (Symbol.for('ts-node.register.instance') && process[Symbol.for('ts-node.register.instance')]) {
        terminal.info('Launch subprocess with ts-node');
        //const inspector = {'execPath ' : './node_modules/.bin/ts-node','execArgv': [ '-r', 'ts-node/register']}; // , '--project', 'tsconfig.json'
        forkedProcess = fork('app.ts', ['subprocess']); // , inspector);
      } else {
        terminal.info('Launch subprocess with nodejs');
        const inspector = { 'execArgv': [], 'env': process.env }; //  --inspect-brk
        forkedProcess = fork('dist/bundle.js', ['subprocess'], inspector);
      }
      const pid = forkedProcess.pid; // + '_' + Date.now();
      let result = undefined;
      this.subProcesses[pid] = forkedProcess;
      this.subProcesses[pid].on('message', (_p) => {
        if (_p['message'] === 'end') {
          result = result ? JSON.parse(result) : result;
        }
        this.messageProcess(_p, pid);
      });
      this.subProcesses[pid].on('error', (_p) => {
        this.errorProcess(_p, pid);
      });
      this.subProcesses[pid].on('close', (_p) => {
        this.closeProcess(_p, pid);
        delete this.subProcesses[pid];
        if (_p === 0) {
          _resolve(result);
        } else {
          _reject(result);
        }
      });
      this.subProcesses[pid].on('disconnect', () => {
        this.disconnectProcess(pid);
      });
      terminal.info('subprocess launched with id: ', pid);
      this.subProcesses[pid].send({
        action: 'launch',
        classPath: this.constructor.name,
        parameters: [parameters]
      });
      return true;
    });
  }

  /**
   * Function called when a message is received from the sub process.
   * @date 20/09/2021 - 08:00:00
   *
   * @private
   * @param {*} _message
   * @param {*} _pid
   */
  private messageProcess(_message, _pid): void {
    terminal.log('received message on subprocess: ' + _pid, _message);
    // do nothing
  }

  /**
   * Function called when an error is received from the sub process.
   * @date 20/09/2021 - 08:00:00
   *
   * @private
   * @param {*} _err
   * @param {*} _pid
   */
  private errorProcess(_err, _pid): void {
    terminal.error('error on subprocess: ' + _pid, _err);
    // do nothing
  }

  /**
   * Function called when the sub process is disconnected.
   * @date 20/09/2021 - 08:00:00
   *
   * @private
   * @param {*} _pid
   */
  private disconnectProcess(_pid): void {
    terminal.info('disconnect subprocess with pid: ' + _pid);
    // do nothing
  }

  /**
   * Function called when the sub process is closed.
   * @date 20/09/2021 - 08:00:00
   *
   * @private
   * @param {*} _close
   * @param {*} _pid
   */
  private closeProcess(_close, _pid): void {
    terminal.info('close on ' + (_pid === 0 ? 'success' : 'error') + ' subprocess with pid:' + _pid);
    // do nothing
  }

}
