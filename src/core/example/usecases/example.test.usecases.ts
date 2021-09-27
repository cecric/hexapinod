import ITest from '@core/example/interfaces/repositories/example.interface';
import { RepositoriesService } from '@core/hexapinod/services/repositories.service';
import ServiceManager from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import terminal from '@dependencies/terminal/terminal';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';



export class ExampleTestUsecases extends UseCases {

  public static async testAction (): Promise<any> {
    terminal.log('test something');
    const repositoriesService: RepositoriesService = ServiceManager.get<RepositoriesService>(RepositoriesService.name);
    const repo = await repositoriesService.getRepositoryByName('test') as ITest;
    const result = await repo.getExample();
    terminal.log(result.toObject());
    return {'ok': true};
  }

}