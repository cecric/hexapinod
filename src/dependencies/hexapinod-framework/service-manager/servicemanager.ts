import * as fs from 'fs';
import terminal from '@dependencies/terminal/terminal';
import { Service } from './service';
import { GenericException } from '@core/hexapinod/exceptions/generic.exception';

/**
 * Class to manage the services (load them, inject if needed other services)
 * @date 22/09/2021 - 08:00:00
 *
 * @class ServiceManager
 * @typedef {ServiceManager}
 */
class ServiceManager {

  /**
   * The persisted instances managed
   * @date 22/09/2021 - 08:00:00
   *
   * @protected
   * @type {Record<string, unknown>}
   */
  protected persistentInstance: Record<string, unknown>;

  /**
   * The instance of singleton
   * @date 22/09/2021 - 08:00:00
   *
   * @protected
   * @static
   * @type {ServiceManager}
   */
  protected static instance: ServiceManager;

  /**
   * The loaded services to instanciates.
   * @date 22/09/2021 - 08:00:00
   *
   * @protected
   * @type {Array<Service>}
   */
  protected services: Array<Service>;


  /**
   * Creates an instance of ServiceManager.
   * @date 22/09/2021 - 08:00:00
   *
   * @constructor
   * @protected
   */
  protected constructor() {
    this.persistentInstance = {};
    this.initializeServiceBundle();
  }

  /**
   * returns the instance of the singleton.
   * @date 22/09/2021 - 08:00:00
   *
   * @public
   * @static
   * @returns {ServiceManager}
   */
  public static getInstance (): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * initialize and load the available services from the bundles.
   * @date 22/09/2021 - 08:00:00
   *
   * @protected
   * @async
   * @returns {Promise<boolean>}
   */
  protected async initializeServiceBundle (): Promise<boolean> {
    terminal.info('[service manager] initialization services started');
    const list = fs.readdirSync(__dirname + '/../../../core/', { withFileTypes: true });
    for (let i = 0; i < list.length; i++) {
      if (list[i].isDirectory()) {
        terminal.info('load bundle ' + list[i].name + ' services' );
        await this.initializeServicesClass (list[i].name + '/services/');
      }
    }
    terminal.success('[service manager] services successfully loaded');
    return true;
  }

  /**
   * initialize the services from a bundle.
   * @date 22/09/2021 - 08:00:00
   *
   * @protected
   * @async
   * @param {string} _directory
   * @returns {Promise<boolean>}
   */
  protected async initializeServicesClass (_directory: string): Promise<boolean> {
    this.services = [];
    const list = fs.readdirSync(__dirname + '/../../../core/' + _directory);
    for (let i = 0; i < list.length; i++) {
      if (list[i].indexOf('.ts') === -1 || list[i].indexOf('.service.ts') === -1) {
        continue;
      }
      terminal.info('load service ' + list[i]);
      const service = await import(__dirname + '/../../../core/' + _directory + list[i]);
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
    return true;
  }

  /**
   * Get service instance by its name
   * @date 22/09/2021 - 08:00:00
   *
   * @public
   * @async
   * @template T
   * @param {string} _name name of service
   * @returns {Promise<T>} the instance
   */
  public async get <T>(_name: string): Promise<T> {
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

    await inst.initialization();
    /* eslint-enable */
    if (inst.isPersistent()) {
      this.persistentInstance[name] = inst;
    }
    return inst;
  }

}

export default ServiceManager.getInstance();