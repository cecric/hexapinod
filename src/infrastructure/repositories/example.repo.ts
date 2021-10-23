import { IExample } from '@core/example/interfaces/repositories/example.interface';
import { Example } from '@core/example/models/example';
import {DBManager} from '@dependencies/mysql-manager/dbmanager';


/**
 * Example repository with internal db manager
 * @date 27/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ExampleRepository
 * @typedef {ExampleRepository}
 * @extends {DBManager}
 * @implements {IExample}
 */
export class ExampleRepository extends DBManager implements IExample {


  /**
   * return the result of an example request
   * @date 27/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @async
   * @returns {Promise<Example>}
   */
  public async getExample(): Promise<Example> {
    const request = /*sql*/`
      SELECT 
        1 AS example
      ;
    `;
    const result = await this.asyncQuery(request);
    const sample = new Example(result[0]);
    return sample;
  }

}