import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';
import { Service } from '@dependencies/hexapinod-framework/service-manager/service';
import { OrmWrapper } from '@dependencies/hexapinod-framework/model/ormwrapper';
import { TypeOrmWrapper } from '@dependencies/typeorm-wrapper/typeormwrapper';


/**
 * The ORM repositories service, used to load repositories with specific ORM
 * (include the management of TypeORM ORM)
 * @date 05/10/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class OrmRepositoriesService
 * @typedef {OrmRepositoriesService}
 * @extends {Service}
 */
export class OrmRepositoriesService extends Service {


  /**
   * List of loaded repositories instances
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {Record<string,IRepository>}
   */
  protected repositories: Record<string,IRepository> = {};


  /**
   * The Wrapper with specific ORM used
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {OrmWrapper}
   */
  protected entityManagerWrapped: OrmWrapper;


  /**
   * Creates an instance of OrmRepositoriesService.
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @constructor
   */
  constructor() {
    super();
  }


  /**
   * Initialization of service
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async initialization(): Promise<void> {
    this.entityManagerWrapped = new TypeOrmWrapper();
    await this.entityManagerWrapped.initialization();
  }


  /**
   * Get the repository loaded with the wrapper and the instance of Model
   * @date 05/10/2021 - 08:00:00
   * @author cecric
   *
   * @param {(Function & IRepository)} _repositoryInstance
   * @returns {Promise<IRepository>} the loaded repository
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  getRepository (_repositoryInstance: Function & IRepository): Promise<IRepository> {
    return Promise.resolve(this.entityManagerWrapped.getRepository(_repositoryInstance));
  }



}