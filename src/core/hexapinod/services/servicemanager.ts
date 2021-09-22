import * as fs from 'fs';
import terminal from '@lib/terminal/terminal';
import { Service } from './service';
import { GenericException } from '@core/hexapinod/exceptions/generic.exception';

/**
 */
class ServiceManager {

  /**
   */
  protected persistentInstance: Record<string, unknown>;
  protected static instance: ServiceManager;

  protected services: Array<Service>;



  protected constructor() {
    this.persistentInstance = {};
    this.initializeServicesClass();
  }

  /**
   * Gets instance
   * @returns instance
   */
  public static getInstance (): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * @returns true if correctly init
   */
  protected async initializeServicesClass (): Promise<boolean> {
    terminal.info('[service manager] initialization services started');
    this.services = [];
    const list = fs.readdirSync(__dirname + '');

    for (let i = 0; i < list.length; i++) {
      if (list[i].indexOf('.ts') === -1 || list[i].indexOf('.service.ts') === -1) {
        continue;
      }
      const service = await import(__dirname + '/' + list[i]);
      const keyservices = Object.keys(service);
      const keyservice = keyservices.length > 0 ? keyservices[0] : 'default';
      const servname = list[i].substr(0, list[i].indexOf('.service'));
      const params = [];
      // parameters disabled
      // add here a potential parameters management
      this.services[servname] = {
        'parameters' : params,
        'service': service[keyservice]
      };
    }
    terminal.success('[service manager] services successfully loaded');
    return true;
  }

  /**
   * Get service instance by its name
   * @param name string of service
   * @returns  the instance
   */
  public get <T>(_name: string): T {
    let name: string = _name;
    if (name.endsWith('Service')) {
      name = name.replace(/Service$/g,'');
    }
    name = name.toLowerCase();
    if (!this.services[name]) {
      return null;
    }
    if (this.persistentInstance[name]) {
      return this.persistentInstance[name] as T;
    }
    const params = [];
    for (let i = 0; i < this.services[name].parameters.length; i++) {
      if (typeof this.services[name]['parameters'][i] === 'undefined') {
        throw new Error('cannot load service parameters, abort');
      }
      params.push(new this.services[name]['parameters'][i]());
    }


    /* eslint-disable */
    const inst:T = new this.services[name].service(...params);
    
    if (!(inst instanceof Service)) {
      throw new GenericException('invalid service loaded, should inherit from Service');
    }
    /* eslint-enable */
    if (inst.isPersistent()) {
      this.persistentInstance[name] = inst;
    }
    return inst;
  }

}

export default ServiceManager.getInstance();