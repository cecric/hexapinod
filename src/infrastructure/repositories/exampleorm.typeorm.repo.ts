import { IExampleOrm } from '@core/example/interfaces/repositories/exampleorm.interface';
import { ExampleMikroOrm } from '@core/example/models/examplemikroorm';
import { EntityRepository } from '@mikro-orm/mariadb';



/**
 * Example Repository using typeORM
 * @date 04/10/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ExampleRepository
 * @typedef {ExampleRepository}
 * @extends {Repository<ExampleOrm>}
 * @implements {IExampleOrm}
 */
export class ExampleRepository extends EntityRepository<ExampleMikroOrm> implements IExampleOrm {

  /**
   * return the result of an example request
   * @date 04/10/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @returns {Promise<ExampleOrm>}
   */
  public getExamples(): Promise<ExampleMikroOrm[]> {
    return this.createQueryBuilder('a')
      .select('*')
      .getResultList();
  }

}