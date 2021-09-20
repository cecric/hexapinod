import ITest from '@core/interfaces/repositories/test.interface';
import { Example } from '@core/models/example';


export default class TestRepository implements ITest {

  public isTest(): Promise<Example> {
    return new Promise((resolve) => {
      resolve(new Example({'test': 'valid test'}));
    });
  }

}