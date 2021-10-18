import { ExampleOrm } from '@core/example/models/exampleorm';
import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';

export interface IExampleOrm extends IRepository {

    getExample(): Promise<ExampleOrm> ;
}