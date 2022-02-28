import { ConfigurationReader } from '@dependencies/configuration-reader/configurationreader';
import { Service } from '@dependencies/hexapinod-framework/service-manager/service';
import { logger } from '@dependencies/logger/logger';
import { createClient } from 'redis';

/**
 * Create a CacheService
 * @author cecric
 * @date 28/02/2022 - 22:00:00
 * @export
 * @class CacheService
 * @extends {Service}
 */
export class CacheService extends Service {

  protected configuration: Record<string, unknown>;
  protected client;
  protected initialized = false;

  /**
   * Creates an instance of CacheService.
   * @date 28/02/2022 - 22:00:00
   * @memberof CacheService
   */
  public constructor () {
    super();
    this.configuration = ConfigurationReader.getConfiguration('dependencies/redis') as Record<string, unknown>;
    let url = this.configuration['host'] || 'localhost';
    if (this.configuration['port']) {
      url = url + ':' + this.configuration['port'];
    }
    if (this.configuration['user'] && this.configuration['password']) {
      url = this.configuration['user'] + ':' + this.configuration['password'] + '@' + url;
    }
    this.client = createClient({'url': 'redis://' + url});
  }

  /**
   * Init cache connection
   * @author cecric
   * @date 28/02/2022 - 22:00:00
   * @return {*}  {Promise<void>}
   * @memberof CacheService
   */
  public async initialization(): Promise<void> {
    if (!this.configuration['enabled']) {
      return ;
    }
    try {
      await this.client.connect();
      this.initialized = true;
    } catch (e) {
      logger.warn('issue on connect redis cache', e.message);
      this.initialized = false;
    }
  }

  /**
   * retrieve from redis cache
   * @author cecric
   * @date 28/02/2022 - 22:00:00
   * @param {*} _args
   * @return {*}  {Promise<object>}
   * @memberof CacheService
   */
  public async returnCacheIfExist (_args: unknown): Promise<any> {
    if (!this.configuration['enabled']) {
      return null;
    }
    if (!this.initialized) {
      return null;
    }
    const key = JSON.stringify(_args);
    let value = null;
    try {
      value = await this.client.get(key);
    } catch (e) {
      logger.warn('issue on get redis cache', e.message);
      value = null;
    }
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  }

  /**
   * Set on redis cache
   * @author cecric
   * @date 28/02/2022 - 22:00:00
   * @param {*} _args
   * @param {any} _value
   * @return {*}  {Promise<void>}
   * @memberof CacheService
   */
  public async setCache (_args: unknown, _value: unknown): Promise<void> {
    if (!this.configuration['enabled']) {
      return ;
    }
    if (!this.initialized) {
      return;
    }
    const key = JSON.stringify(_args);
    const value = JSON.stringify(_value);
    try {
      await this.client.set(key,value);
    } catch (e) {
      logger.warn('issue on set redis cache', e.message);
    }
  }

}

