import { IExample } from '@core/example/interfaces/repositories/example.interface';
import { Example } from '@core/example/models/example';


export class ExampleRepository implements IExample {

  public getExample(): Promise<Example> {
    return new Promise((resolve) => {
      resolve(new Example({'test': 'valid test'}));
    });
  }

}