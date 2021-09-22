import { Service } from './service';
import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import addErrors from 'ajv-errors';
import { InvalidParametersException } from '@core/hexapinod/exceptions/invalidparameters.exception';
import terminal from '@lib/terminal/terminal';


export class ValidatorService extends Service {

    protected instance: Ajv = null;


    constructor() {
      super();
    }


    public async loadValidatorSchemas(): Promise<void> {
      this.instance = new Ajv({allErrors: true});
      addFormats(this.instance);
      addKeywords(this.instance);
      addErrors(this.instance);
      terminal.info('[service manager] initialization validators');
      const bundles = fs.readdirSync(__dirname + '/../../', { withFileTypes: true });
      for (let i = 0; i < bundles.length; i++) {
        if (bundles[i].isDirectory()) {
          terminal.info('load bundle ' + bundles[i].name + ' validators' );
          if (!fs.existsSync(__dirname + '/../../' + bundles[i].name + '/services/validator')) {
            terminal.warn('path does\'t exists, no validator available for bundle: ' + __dirname + '/../../' + bundles[i].name + '/services/validator');
            continue;
          }
          const list = fs.readdirSync(__dirname + '/../../' + bundles[i].name + '/services/validator');
          for (let j = 0; j < list.length; j++) {
            if (list[j].indexOf('.ts') === -1 || list[j].indexOf('.schema.ts') === -1) {
              continue;
            }
            try {
              const schema = await import(__dirname + '/../../' + bundles[i].name + '/services/validator/' + list[j]);
              this.instance.addSchema(schema.default, list[j].substr(0, list[j].indexOf('.schema')));
              terminal.info('init validation schema : ' + list[j].substr(0, list[j].indexOf('.schema')));
            } catch (e) {
              terminal.error('issue on load validation schema', e);
            }
          }
        }
      }
      terminal.success('[service manager] validators successfully loaded');
    }

    public async validate<T>(_name: string, _data: unknown, _throwError = true): Promise<boolean> {
      if (this.instance === null) {
        await this.loadValidatorSchemas();
      }
      const validated = this.instance.getSchema<T>(_name);
      if (!validated(_data)) {
        if (_throwError) {
          const message = validated.errors.map(val => val.message).join(', ');
          throw new InvalidParametersException(message);
        } else {
          return false;
        }
      }
      return true;
    }


}