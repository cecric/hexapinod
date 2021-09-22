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
      const list = fs.readdirSync(__dirname + '/validator');
      for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf('.ts') === -1 || list[i].indexOf('.schema.ts') === -1) {
          continue;
        }
        try {
          const schema = await import(__dirname + '/validator/' + list[i]);
          this.instance.addSchema(schema.default, list[i].substr(0, list[i].indexOf('.schema')));
          terminal.log('init validation schema : ' + list[i].substr(0, list[i].indexOf('.schema')));
        } catch (e) {
          terminal.error('issue on load validation schema', e);
        }
      }
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