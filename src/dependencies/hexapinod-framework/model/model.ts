


/**
 * Abstract Model, includes serializer and unserializer
 * Includes also anotations to check types
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @abstract
 * @class Model
 * @typedef {Model}
 */
export abstract class Model {

  /**
   * Annotation check the value is a valid string
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static STRING(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val:string = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && typeof val !== 'string') {
          throw new Error('invalid type, must be string, is ' + typeof val);
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid number
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static NUMERIC(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val:number = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && typeof val !== 'number') {
          throw new Error('invalid type, must be number, is ' + typeof val);
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid boolean
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static BOOLEAN(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val:boolean = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && typeof val !== 'boolean') {
          throw new Error('invalid type, must be boolean, is ' + typeof val);
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid Date
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static DATE(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Date = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!(val instanceof Date) || isNaN(val.valueOf()))) {
          throw new Error('invalid type, must be Date');
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid object of type T
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @template T
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static OBJECT<T>(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: T = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && typeof val !== 'object') {
          throw new Error('invalid type, must be object, is ' + typeof val);
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid Array of numbers
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static ARRAY_NUMERIC(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Array<number> = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!Array.isArray(val) || (val.length > 0 && val.filter(value => typeof value === 'number').length === 0))) {
          throw new Error('invalid type, must be array of numbers');
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid array of strings
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static ARRAY_STRING(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Array<string> = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!Array.isArray(val) || (val.length > 0 && val.filter(value => typeof value === 'string').length === 0))) {
          throw new Error('invalid type, must be array of strings');
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid array of Dates
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static ARRAY_DATE(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Array<Date> = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!Array.isArray(val) || (val.length > 0 && val.filter(value => value instanceof Date).length === 0))) {
          throw new Error('invalid type, must be array of Date');
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid array of booleans
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static ARRAY_BOOLEAN(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Array<boolean> = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!Array.isArray(val) || (val.length > 0 && val.filter(value => typeof value === 'boolean').length === 0))) {
          throw new Error('invalid type, must be array of booleans');
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid array of object of type T
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @template T
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static ARRAY_OBJECT<T>(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Array<T> = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!Array.isArray(val) || (val.length > 0 && val.filter(value => typeof value === 'object').length === 0))) {
          throw new Error('invalid type, must be array of object');
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * Annotation check the value is a valid two dimensionnal array of numbers
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static ARRAY_ARRAY_NUMERIC(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Array<Array<number>> = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!Array.isArray(val) || (val.length > 0 && val.filter(value => Array.isArray(value) && value.filter(subvalue => typeof subvalue === 'number').length > 0).length === 0))) {
          throw new Error('invalid type, must be array of numbers');
        }
        return originalMethod.apply(this, args);
      };
    };
  }


  /**
   * Annotation check the value is a valid two dimensionnal array of string
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @static
   * @param {boolean} [_strict=false]
   * @returns {*}
   */
  static ARRAY_ARRAY_STRING(_strict = false): any {
    return (_target: unknown, _methodKey: string, _descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        const val: Array<Array<string>> = args[0];
        if ((_strict || (typeof val !== 'undefined' && val !== null)) && (!Array.isArray(val) || (val.length > 0 && val.filter(value => Array.isArray(value) && value.filter(subvalue => typeof subvalue === 'string').length > 0).length === 0))) {
          throw new Error('invalid type, must be array of string');
        }
        return originalMethod.apply(this, args);
      };
    };
  }

  /**
   * List of keys to ignore during serialization
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {Array<string>}
   */
  protected excludesSerializer: Array<string>;

  /**
   * Creates an instance of Model. Initialize with values from classic objects for values which have
   * a setter.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @constructor
   * @public
   * @param {?object} [values]
   */
  public constructor(values?: Record<string, unknown>) {
    this.fromObject(values);
  }

  /**
   * add a key to exclude in serialization.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {string} _key
   */
  public addExcludeSerialize(_key: string): void {
    if (typeof this.excludesSerializer === 'undefined' || this.excludesSerializer === null) {
      this.excludesSerializer = [];
    }
    this.excludesSerializer.push(_key);
  }

  /**
   * read values from object and call setters of models. Used to convert an object
   * (ex: a result from a database, parameter body from a requests, ...) into the model.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {?unknown} [values]
   */
  protected fromObject(values?: unknown): void {
    if (values && typeof values === 'object') {
      for (const key in values) {
        if (values[key] === undefined) {
          continue;
        }
        const curkey = 'set' + key.split('_').map(function (val) {
          return val.length > 0 ? val.charAt(0).toUpperCase() + val.slice(1) : val; // index > 0 &&
        }).join('').trim();
        if (curkey in this && typeof this[curkey] !== 'undefined' && typeof this[curkey] === 'function') { // typeof values[key]){
          this[curkey](values[key]);
        }
      }
    }
  }

  /**
   * Serializer to object
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {?unknown} [values]
   */
  public toObject(): Record<string, unknown> {
    const vars = Object.getOwnPropertyNames(this);
    const serialized = {};
    const toExcludefields = [];
    for (let i = 0; i < vars.length; i++) {
      if (this.excludesSerializer && this.excludesSerializer.includes(vars[i]) || vars[i] === 'excludesSerializer') {
        continue;
      }
      if (toExcludefields && toExcludefields.includes(vars[i])) {
        continue;
      }
      const key = vars[i].replace(/[A-Z]{1}[a-z0-9]/g, function (m) {
        return '_' + m;
      // eslint-disable-next-line prefer-named-capture-group
      }).replace(/([a-z0-9])([A-Z])/g, function (m) {
        return m[0] + '_' + m[1];
      }).toLowerCase();

      if (this[vars[i]] !== undefined && this[vars[i]] !== null && typeof this[vars[i]] !== 'function') {
        if (this[vars[i]] instanceof Model) {
          serialized[key] = this[vars[i]].toObject();
        } else if (typeof this[vars[i]] === 'object' && !Object.keys(this[vars[i]]).some(x => typeof x === 'number' && !isNaN(x))) {
          if (Object.keys(this[vars[i]]).filter(val => !isNaN(parseInt(val)) && ('' + parseInt(val)) === val).length > 0 && Object.values(this[vars[i]]).length > 0) {
            serialized[key] = Object.values(this[vars[i]]).map((val: any) => {
              if (val instanceof Model) {
                return val.toObject();
              } else {
                return val;
              }
            });
          } else if(Object.values(this[vars[i]]).length > 0) {
            serialized[key] = {};
            for (const subk in this[vars[i]]) {
              if (this[vars[i]][subk] instanceof Model) {
                serialized[key][subk] = this[vars[i]][subk].toObject();
              } else {
                serialized[key][subk] = this[vars[i]][subk];
              }
            }
          } else {
            serialized[key] = this[vars[i]];
          }
        } else if (this[vars[i]] instanceof Array) {
          serialized[key] = this[vars[i]].map((val: any) => {
            if (val instanceof Model) {
              return val.toObject();
            } else {
              return val;
            }
          });
        } else {
          serialized[key] = this[vars[i]];
        }
      }
    }
    return serialized;
  }

  /**
   * Function to compare two model objects
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {Model} objectToCompare
   * @returns {boolean}
   */
  public shallowEqual (objectToCompare: Model): boolean {
    const keys1 = Object.keys(this);
    const keys2 = Object.keys(objectToCompare);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (this[key] !== objectToCompare[key]) {
        return false;
      }
    }
    return true;
  }

}