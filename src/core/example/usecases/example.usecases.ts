import ITest from '@core/example/interfaces/repositories/example.interface';
import { Example } from '@core/example/models/example';
import { EventsManager } from '@dependencies/hexapinod-framework/events/eventsmanager';
import { RepositoriesService } from '@core/hexapinod/services/repositories.service';
import ServiceManager from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import { ValidatorService } from '@core/hexapinod/services/validator.service';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';
import ExampleListener from '../eventslisteners/examplelistener.event';



export class ExampleUsecases extends UseCases {

  public static async exampleValidatorAction (): Promise<any> {
    const ex = new Example();
    ex.setExample('sample@example.fr');
    ex.setDateExample(new Date());
    const validatorService: ValidatorService = ServiceManager.get<ValidatorService>(ValidatorService.name);
    await validatorService.validate<Example>('example', ex.toObject());
    return {'ok': true};
  }

  public static async exampleEventAction (): Promise<any> {
    await EventsManager.getInstance().asyncDispatch(ExampleListener.EVENT_DEFAULT_EXAMPLE, {'email': 'test@test.test', 'data': 'sample'});
    return {'ok': true};
  }

  public static async exampleRepositoryAction (): Promise<any> {
    const repositoriesService: RepositoriesService = ServiceManager.get<RepositoriesService>(RepositoriesService.name);
    const repo = await repositoriesService.getRepositoryByName('test') as ITest;
    const result = await repo.getExample();
    return result;
  }

  public static async exampleSubprocessAction (): Promise<any> {
    const validatorService:ValidatorService = ServiceManager.get('validator');
    await validatorService.fork({'test': true});
    return {'ok': true};
  }

}