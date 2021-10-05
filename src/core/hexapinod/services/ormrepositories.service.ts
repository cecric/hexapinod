import IRepository from '@core/hexapinod/interfaces/repositories/repository.interface';
import { Service } from '@dependencies/hexapinod-framework/service-manager/service';
import { OrmWrapper } from '@dependencies/hexapinod-framework/model/ormwrapper';
import { TypeOrmWrapper } from '@dependencies/typeorm-wrapper/typeormwrapper';


export class OrmRepositoriesService extends Service {

  protected repositories: Record<string,IRepository> = {};
  protected entityManagerWrapped: OrmWrapper;

  constructor() {
    super();
  }

  public async initialization(): Promise<void> {
    this.entityManagerWrapped = new TypeOrmWrapper();
    await this.entityManagerWrapped.initialization();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getRepository (_repositoryInstance: Function & IRepository): Promise<IRepository> {
    return Promise.resolve(this.entityManagerWrapped.getRepository(_repositoryInstance));
  }



}