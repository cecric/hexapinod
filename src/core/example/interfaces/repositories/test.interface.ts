import { Example } from '@core/example/models/example';
import IRepository from '@core/hexapinod/interfaces/repositories/repository.interface';

export default interface ITest extends IRepository {

    isTest(): Promise<Example> ;
}