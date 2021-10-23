import { IExample } from '@core/example/interfaces/repositories/example.interface';
import { Example } from '@core/example/models/example';
import { EventsManager } from '@dependencies/hexapinod-framework/events/eventsmanager';
import { RepositoriesService } from '@core/hexapinod/services/repositories.service';
import { ServiceManager } from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import { ValidatorService } from '@core/hexapinod/services/validator.service';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';
import { ExampleListener } from '../eventslisteners/examplelistener.event';


/**
 * Example Usecases
 * @date 27/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ExampleUsecases
 * @typedef {ExampleUsecases}
 * @extends {UseCases}
 */
export class ExampleUsecases extends UseCases {

  /**
   * Validator service example
   * @date 28/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @returns {Promise<Example>}
   */
  public static async exampleValidatorAction (): Promise<Example> {
    const ex = new Example();
    ex.setExample('sample@example.fr');
    ex.setDateExample(new Date());
    const validatorService: ValidatorService = await ServiceManager.get<ValidatorService>(ValidatorService.name);
    await validatorService.validate<Example>('example', ex.toObject());
    return ex;
  }

  /**
   * Event dispatch example
   * @date 28/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @returns {Promise<any>}
   */
  public static async exampleEventAction (): Promise<any> {
    await EventsManager.asyncDispatch(ExampleListener.EVENT_DEFAULT_EXAMPLE, {'email': 'test@test.test', 'data': 'sample'});
    return {'ok': true};
  }

  /**
   * Repository service example
   * @date 28/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @returns {Promise<Example>}
   */
  public static async exampleRepositoryAction (): Promise<Example> {
    const repositoriesService: RepositoriesService = await ServiceManager.get<RepositoriesService>(RepositoriesService.name);
    const repo = await repositoriesService.getRepositoryByName('example') as IExample;
    const result = await repo.getExample();
    return result;
  }

  /**
   * Sub process launch (from any service) example
   * @date 28/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @returns {Promise<any>}
   */
  public static async exampleSubprocessAction (): Promise<any> {
    const validatorService:ValidatorService = await ServiceManager.get('validator');
    await validatorService.fork({'test': true});
    return {'ok': true};
  }

}