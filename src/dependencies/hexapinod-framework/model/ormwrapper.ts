import IRepository from '@core/hexapinod/interfaces/repositories/repository.interface';


export abstract class OrmWrapper {

  public initialization (): Promise<void> {
    // By default do nothing
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public abstract getRepository (_entityModel: Function & IRepository, _connectionName?:string): IRepository;

}