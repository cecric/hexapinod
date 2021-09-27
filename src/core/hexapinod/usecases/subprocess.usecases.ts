import { Service } from '@dependencies/hexapinod-framework/service-manager/service';
import servicemanager from '@dependencies/hexapinod-framework/service-manager/servicemanager';
import { UseCases } from '@core/hexapinod/usecases/usecases';
import terminal from '@dependencies/terminal/terminal';



export class SubProcessUsecases extends UseCases {


  public static start (): void {

    terminal.log('start subprocess');

    const onError = function (_err) {
      terminal.error('Closing subprocess', _err);
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
          terminal.log('launch subprocss for service ' + _p['classPath'], 'with parameters ', parameters);
          result = await servicemanager.get<Service>(_p['classPath'].replace(/Service$/, '').toLowerCase()).execInSubProcess(parameters);
          result = JSON.stringify(result);
        }
      } catch (e) {
        error = JSON.stringify(e);
        terminal.error(e.message, e.stack);
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