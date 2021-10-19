import { IExample } from '@core/example/interfaces/repositories/example.interface';
import { RepositoriesService } from '@core/hexapinod/services/repositories.service';
import { ServiceManager } from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import terminal from '@dependencies/terminal/terminal';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';
import { OrmRepositoriesService } from '@core/hexapinod/services/ormrepositories.service';
import { ExampleOrm } from '../models/exampleorm';
import { IExampleOrm } from '../interfaces/repositories/exampleorm.interface';



export class ExampleTestUsecases extends UseCases {

  public static async testAction (): Promise<any> {
    terminal.log('test something');
    const repositoriesService: RepositoriesService = await ServiceManager.get<RepositoriesService>(RepositoriesService.name);
    const repo = await repositoriesService.getRepositoryByName('example') as IExample;
    const result = await repo.getExample();
    terminal.log(result.toObject());
    const ormrepositoriesService: OrmRepositoriesService = await ServiceManager.get<OrmRepositoriesService>(OrmRepositoriesService.name);
    const repo2 = await ormrepositoriesService.getRepository(ExampleOrm) as IExampleOrm;
    const result2 = await repo2.getExample();
    terminal.log(result2.toObject());
    return {'ok': true};
  }

}