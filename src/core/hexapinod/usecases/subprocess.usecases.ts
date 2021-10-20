import { Service } from '@dependencies/hexapinod-framework/service-manager/service';
import { ServiceManager } from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';
import { logger } from '@dependencies/logger/logger';



/**
 * Class to handle subprocess use cases
 * @date 20/09/2021 - 20:00:00
 *
 * @export
 * @class SubProcessUsecases
 * @typedef {SubProcessUsecases}
 * @extends {UseCases}
 */
export class SubProcessUsecases extends UseCases {


  /**
   * Start loop for sub process and call the corresponding service received by event
   * @date 20/09/2021 - 20:00:00
   *
   * @public
   * @static
   */
  public static start (): void {

    logger.log('start subprocess');

    const onError = function (_err) {
      logger.error('Closing subprocess', _err);
      process.send({
        message :'end' ,
        result: JSON.stringify(_err)
      });
      setTimeout(function () {
        process.exit(1);
      }, 25000);
    };
    process.on('SIGINT', onError);
    process.on('SIGSEGV', onError);
    process.on('uncaughtException', onError);

    process.on('message', async (_p) => {
      let result = null;
      let error = null;
      try {
        if(_p['action'] === 'launch') {
          const parameters = JSON.parse(_p['parameters']);
          logger.log('launch subprocss for service ' + _p['classPath'], 'with parameters ', parameters);
          const service = await ServiceManager.get<Service>(_p['classPath'].replace(/Service$/, '').toLowerCase());
          result = await service.execInSubProcess(parameters);
          result = JSON.stringify(result);
        }
      } catch (e) {
        error = JSON.stringify(e);
        logger.error(e.message, e.stack);
      }
      if(_p['action'] === 'launch') {
        setTimeout(() => {
          process.send({
            message : 'end',
            detail : error ? 'error : ' + error.message : 'end',
            result: result,
            p : {
              pid :process.pid
            }
          });
          process.exit(error ? 1 : 0);
        }, 100);
      }
    });

  }
}