import { Example } from '@core/example/models/example';
import IRepository from '@core/hexapinod/interfaces/repositories/repository.interface';

export default interface IExample extends IRepository {

    getExample(): Promise<Example> ;
}