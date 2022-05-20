import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';
import { ConfigurationReader } from '@dependencies/configuration-reader/configurationreader';
import { OrmWrapper } from '@dependencies/hexapinod-framework/model/ormwrapper';
import { logger } from '@dependencies/logger/logger';
import { MikroORM } from '@mikro-orm/core';
// EntityManager, EntityRepository, RequestContext, Entity

/**
 * OrmWrapper to handle MikroOrm into the framework hexapinod
 * @date 20/05/2022 - 13:45:00
 * @author cecric
 *
 * @export
 * @class MikroOrmWrapper
 * @typedef {MikroOrmWrapper}
 * @extends {OrmWrapper}
 */
export class MikroOrmWrapper extends OrmWrapper {


  /**
   * Type of ORM
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static ORM_SUFFIXE = 'mikroorm';

  protected connections: Array<MikroORM>;

  /**
   * Initialize the ORM (load the databases configuration with the configuration reader)
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @async
   * @returns {Promise<void>}
   */
  async initialization (): Promise<void> {
    const dbconfs: any = ConfigurationReader.getConfiguration('dependencies/mikroorm');
    if (Array.isArray(dbconfs)) {
      dbconfs.forEach(element => {
        element['logger']= (message: string) => logger.info(message);
      });
    } else {
      dbconfs['logger']= (message: string) => logger.info(message);
    }
    this.connections.push(await MikroORM.init(dbconfs));
  }


  /**
   * Return the current repository for the entity
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {(Function & IRepository)} _entityModel
   * @param {?string} [_connectionName]
   * @returns {IRepository}
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getRepository (_entityModel: Function & IRepository, _connectionName?:string): IRepository {
    return (_connectionName ? this.connections.find(val => val['name'] === _connectionName) : this.connections[0]).em.getRepository(_entityModel) as IRepository;
  }

}