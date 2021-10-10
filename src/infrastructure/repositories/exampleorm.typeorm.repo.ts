import IExampleOrm from '@core/example/interfaces/repositories/exampleorm.interface';
import { ExampleOrm } from '@core/example/models/exampleorm';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(ExampleOrm)
export default class ExampleRepository extends Repository<ExampleOrm> implements IExampleOrm {

  public getExample(): Promise<ExampleOrm> {
    const request = /*sql*/`
        SELECT 
          1 AS example
        ;
      `;
    return this.query(request);
  }

}