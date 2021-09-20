import { Example } from '@core/models/example';
import IRepository from './repository.interface';

export default interface ITest extends IRepository {

    isTest(): Promise<Example> ;
}