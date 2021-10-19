import { IExample } from '@core/example/interfaces/repositories/example.interface';
import { Example } from '@core/example/models/example';
import {DBManager} from '@dependencies/mysql-manager/dbmanager';


export class ExampleRepository extends DBManager implements IExample {

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