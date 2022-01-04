import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';
import { ConfigurationReader } from '@dependencies/configuration-reader/configurationreader';
import { OrmWrapper } from '@dependencies/hexapinod-framework/model/ormwrapper';
// issue with ESM project: https://github.com/typeorm/typeorm/issues/8418
// import { Connection, createConnections, ObjectType } from 'typeorm';
import TypeORM from 'typeorm';


/**
 * OrmWrapper to handle TypeORM into the framework hexapinod
 * @date 05/10/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class TypeOrmWrapper
 * @typedef {TypeOrmWrapper}
 * @extends {OrmWrapper}
 */
export class TypeOrmWrapper extends OrmWrapper {


  /**
   * Type of ORM
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static ORM_SUFFIXE = 'typeorm';

  /**
   * List of loaded connections
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {Array<Connection>}
   */
  protected connections: Array<TypeORM.Connection>;

  /**
   * Initialize the ORM (load the databases configuration with the configuration reader)
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @async
   * @returns {Promise<void>}
   */
  async initialization (): Promise<void> {
    const dbconfs: any = ConfigurationReader.getConfiguration('dependencies/typeorm');
    this.connections = await TypeORM.createConnections(dbconfs);
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
    return (_connectionName ? this.connections.find(val => val['name'] === _connectionName) : this.connections[0]).getCustomRepository(_entityModel as TypeORM.ObjectType<IRepository>) as IRepository;
  }

}