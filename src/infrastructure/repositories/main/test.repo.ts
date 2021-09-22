import ITest from '@core/example/interfaces/repositories/test.interface';
import { Example } from '@core/example/models/example';
import {DBManager} from '@lib/mysql-manager/dbmanager';


export default class TestRepository extends DBManager implements ITest {

  public async isTest(): Promise<Example> {
    const request = /*sql*/`
      SELECT 
        username AS example
      FROM user
      WHERE 
        email = ${this.escape('cedric@sublivin.com')}
      LIMIT 1;
    `;
    const result = await this.asyncQuery(request);
    const sample = new Example(result[0]);
    return sample;
  }

}