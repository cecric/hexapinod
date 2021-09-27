import ITest from '@core/example/interfaces/repositories/example.interface';
import { Example } from '@core/example/models/example';
import { EventsManager } from '@dependencies/hexapinod-framework/events/eventsmanager';
import { RepositoriesService } from '@core/hexapinod/services/repositories.service';
import ServiceManager from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import { ValidatorService } from '@core/hexapinod/services/validator.service';
import terminal from '@dependencies/terminal/terminal';
import AuthentificationListener from '../eventslisteners/authentificationlistener.event';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';



export class ExampleUsecases extends UseCases {

  public static async exampleAction (): Promise<any> {
    await EventsManager.getInstance().asyncDispatch(AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT, {'email': 'test@test.test', 'password': 'test', 'networkInfo': []});
    const ex = new Example();
    ex.setExample('yolo@yolo.fr');
    ex.setDateExample(new Date());
    terminal.log(ex.toObject());
    const validatorService: ValidatorService = ServiceManager.get<ValidatorService>(ValidatorService.name);
    await validatorService.validate<Example>('example', ex.toObject());
    const repositoriesService: RepositoriesService = ServiceManager.get<RepositoriesService>(RepositoriesService.name);
    const repo = await repositoriesService.getRepositoryByName('test') as ITest;
    const result = await repo.getExample();
    terminal.log(result.toObject());
    return {'ok': true};
  }

  public static async testSubprocessAction (): Promise<any> {
    const validatorService:ValidatorService = ServiceManager.get('validator');
    await validatorService.fork({'test': true});
    return {'ok': true};
  }

}