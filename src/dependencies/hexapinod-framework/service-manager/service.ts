// import { Worker } from 'worker_threads';

import terminal from '@dependencies/terminal/terminal';
import { fork } from 'child_process';

export abstract class Service {

  protected subProcesses: unknown = {};

  isPersistent (): boolean {
    return true;
  }

  public initialization (): Promise<void>{
    // default do nothing
    return Promise.resolve();
  }

  public execInSubProcess (_parameters:unknown): unknown {
    terminal.log('sub process in service ' + this.constructor.name + ' called with parameters', _parameters);
    throw new Error('should be implemented');
    // return {'ok':true};
  }

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

  private messageProcess(_message, _pid): void {
    terminal.log('received message on subprocess: ' + _pid, _message);
    // do nothing
  }

  private errorProcess(_err, _pid): void {
    terminal.error('error on subprocess: ' + _pid, _err);
    // do nothing
  }

  private disconnectProcess(_pid): void {
    terminal.info('disconnect subprocess with pid: ' + _pid);
    // do nothing
  }

  private closeProcess(_close, _pid): void {
    terminal.info('close on ' + (_pid === 0 ? 'success' : 'error') + ' subprocess with pid:' + _pid);
    // do nothing
  }

}
