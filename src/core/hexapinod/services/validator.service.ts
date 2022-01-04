import { Service } from '../../../dependencies/hexapinod-framework/service-manager/service';
import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import addErrors from 'ajv-errors';
import { InvalidParametersException } from '@core/hexapinod/exceptions/invalidparameters.exception';
import { logger } from '@dependencies/logger/logger';


/**
 * Validator service to perform validation with AJV
 * @date 20/09/2021 - 20:00:00
 * @author cecric
 *
 * @export
 * @class ValidatorService
 * @typedef {ValidatorService}
 * @extends {Service}
 */
export class ValidatorService extends Service {

    /**
     * The AJV loaded engines
     * @date 20/09/2021 - 20:00:00
     * @author cecric
     *
     * @protected
     * @type {Ajv}
     */
    protected instance: Ajv = null;


    /**
     * Creates an instance of ValidatorService.
     * @date 20/09/2021 - 20:00:00
     * @author cecric
     *
     * @constructor
     */
    constructor() {
      super();
    }

    /**
     * Initialization of service
     * @date 20/09/2021 - 20:00:00
     * @author cecric
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    public async initialization(): Promise<void> {
      await this.loadValidatorSchemas();
    }

    /**
     * Load the validation schemas from all the bundles
     * @date 20/09/2021 - 20:00:00
     * @author cecric
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    public async loadValidatorSchemas(): Promise<void> {
      this.instance = new Ajv({allErrors: true});
      addFormats(this.instance);
      addKeywords(this.instance);
      addErrors(this.instance);
      logger.info('[service manager] initialization validators');
      const bundles = fs.readdirSync(new URL('.', import.meta.url).pathname + '../../', { withFileTypes: true });
      for (let i = 0; i < bundles.length; i++) {
        if (bundles[i].isDirectory()) {
          logger.info('load bundle ' + bundles[i].name + ' validators' );
          if (!fs.existsSync(new URL('.', import.meta.url).pathname + '../../' + bundles[i].name + '/services/validator')) {
            logger.warn('path does\'t exists, no validator available for bundle: ' + new URL('.', import.meta.url).pathname + '../../' + bundles[i].name + '/services/validator');
            continue;
          }
          const list = fs.readdirSync(new URL('.', import.meta.url).pathname + '../../' + bundles[i].name + '/services/validator');
          for (let j = 0; j < list.length; j++) {
            if (!list[j].endsWith('.schema.ts') && !list[j].endsWith('.schema.js')) {
              continue;
            }
            try {
              const schema = await import(new URL('.', import.meta.url).pathname + '../../' + bundles[i].name + '/services/validator/' + list[j]);
              const keyschemas = Object.keys(schema);
              const keyschema = keyschemas.length > 0 ? keyschemas[0] : 'default';
              this.instance.addSchema(schema[keyschema], list[j].substr(0, list[j].indexOf('.schema')));
              logger.info('init validation schema : ' + list[j].substr(0, list[j].indexOf('.schema')));
            } catch (e) {
              logger.error('issue on load validation schema', e);
            }
          }
        }
      }
      logger.success('[service manager] validators successfully loaded');
    }

    /**
     * Validate the object with the Schema _name
     * @date 20/09/2021 - 20:00:00
     * @author cecric
     *
     * @public
     * @async
     * @template T
     * @param {string} _name the schema to validate
     * @param {unknown} _data the data object to validate
     * @param {boolean} [_throwError=true]
     * @returns {Promise<boolean>} true if validated, false or throw error if not
     */
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