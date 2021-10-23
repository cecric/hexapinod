import { IExampleOrm } from '@core/example/interfaces/repositories/exampleorm.interface';
import { ExampleOrm } from '@core/example/models/exampleorm';
import { EntityRepository, Repository } from 'typeorm';



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
@EntityRepository(ExampleOrm)
export class ExampleRepository extends Repository<ExampleOrm> implements IExampleOrm {

  /**
   * return the result of an example request
   * @date 04/10/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @returns {Promise<ExampleOrm>}
   */
  public getExample(): Promise<ExampleOrm> {
    const request = /*sql*/`
        SELECT 
          1 AS example
        ;
      `;
    return this.query(request);
  }

}