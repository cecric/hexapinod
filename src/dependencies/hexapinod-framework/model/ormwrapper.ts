import IRepository from '@core/hexapinod/interfaces/repositories/repository.interface';


/**
 * Wrapper class, to wrapp an external ORM into the framework.
 * @date 17/10/2021 - 08:00:00
 *
 * @export
 * @abstract
 * @class OrmWrapper
 * @typedef {OrmWrapper}
 */
export abstract class OrmWrapper {

  /**
   * Initialization function to init the ORM
   * @date 05/10/2021 - 08:00:00
   *
   * @public
   * @returns {Promise<void>}
   */
  public initialization (): Promise<void> {
    // By default do nothing
    return Promise.resolve();
  }

  /**
   * Function which returns the repository class loaded by the ORM
   * @date 05/10/2021 - 08:00:00
   *
   * @public
   * @abstract
   * @param {(Function & IRepository)} _entityModel
   * @param {?string} [_connectionName]
   * @returns {IRepository}
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public abstract getRepository (_entityModel: Function & IRepository, _connectionName?:string): IRepository;

}