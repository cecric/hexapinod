import { IExample } from '@core/example/interfaces/repositories/example.interface';
import { Example } from '@core/example/models/example';


/**
 * Another example in subfolder
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ExampleRepository
 * @typedef {ExampleRepository}
 * @implements {IExample}
 */
export class ExampleRepository implements IExample {

  /**
   * return the result of an example request
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @returns {Promise<Example>}
   */
  public getExample(): Promise<Example> {
    return new Promise((resolve) => {
      resolve(new Example({'test': 'valid test'}));
    });
  }

}