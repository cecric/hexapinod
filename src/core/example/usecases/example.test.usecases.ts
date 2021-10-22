import { IExample } from '@core/example/interfaces/repositories/example.interface';
import { RepositoriesService } from '@core/hexapinod/services/repositories.service';
import { ServiceManager } from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import { logger } from '@dependencies/logger/logger';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';
import { OrmRepositoriesService } from '@core/hexapinod/services/ormrepositories.service';
import { ExampleOrm } from '../models/exampleorm';
import { IExampleOrm } from '../interfaces/repositories/exampleorm.interface';
import { ValidatorService } from '@core/hexapinod/services/validator.service';
import { Example } from '../models/example';

/**
 * Test usecase example
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ExampleTestUsecases
 * @typedef {ExampleTestUsecases}
 * @extends {UseCases}
 */
export class ExampleTestUsecases extends UseCases {


  /**
   * Test the validator service
   * @date 22/10/2021 - 16:44:59
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @returns {Promise<any>}
   */
  public static async testValidatorAction (): Promise<any> {
    const ex = new Example();
    ex.setExample('sample@example.fr');
    ex.setDateExample(new Date());
    const validatorService: ValidatorService = await ServiceManager.get<ValidatorService>(ValidatorService.name);
    await validatorService.validate<Example>('example', ex.toObject());
    return {'ok': true};
  }

  /**
   * Test the orm services
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @returns {Promise<any>}
   */
  public static async testDatabaseRepositoriesAction (): Promise<any> {
    const repositoriesService: RepositoriesService = await ServiceManager.get<RepositoriesService>(RepositoriesService.name);
    const repo = await repositoriesService.getRepositoryByName('example') as IExample;
    const result = await repo.getExample();
    logger.log(result.toObject());
    const ormrepositoriesService: OrmRepositoriesService = await ServiceManager.get<OrmRepositoriesService>(OrmRepositoriesService.name);
    const repo2 = await ormrepositoriesService.getRepository(ExampleOrm) as IExampleOrm;
    const result2 = await repo2.getExample();
    logger.log(result2.toObject());
    return {'ok': true};
  }

}