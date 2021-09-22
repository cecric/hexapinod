import ITest from '@core/example/interfaces/repositories/test.interface';
import { Example } from '@core/example/models/example';
import { RepositoriesService } from '@core/hexapinod/services/repositories.service';
import ServiceManager from '@core/hexapinod/services/servicemanager';
import { ValidatorService } from '@core/hexapinod/services/validator.service';
import { UseCases } from '@core/hexapinod/usecases/usecases';
import terminal from '@lib/terminal/terminal';



export class TestUsecases extends UseCases {

  public static async testAction (): Promise<any> {
    const ex = new Example();
    ex.setExample('yolo@yolo.fr');
    ex.setDateExample(new Date());
    terminal.log(ex.toObject());
    const validatorService: ValidatorService = ServiceManager.get<ValidatorService>(ValidatorService.name);
    await validatorService.validate<Example>('example', ex.toObject());
    const repositoriesService: RepositoriesService = ServiceManager.get<RepositoriesService>(RepositoriesService.name);
    const repo = await repositoriesService.getRepositoryByName('test') as ITest;
    const result = await repo.isTest();
    terminal.log(result.toObject());
    return {'ok': true};
  }

  public static async testSubprocessAction (): Promise<any> {
    const validatorService:ValidatorService = ServiceManager.get('validator');
    await validatorService.fork({'test': true});
    return {'ok': true};
  }

}