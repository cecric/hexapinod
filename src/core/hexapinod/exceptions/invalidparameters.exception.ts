
/**
 * Invalid parameter(s) exception. Used by express middleware to send a 400 HTTP error.
 * @date 20/09/2021 - 20:00:00
 *
 * @export
 * @class InvalidParametersException
 * @typedef {InvalidParametersException}
 * @extends {Error}
 */
export class InvalidParametersException extends Error {

  /**
   * Creates an instance of InvalidParametersException.
   * @date 20/09/2021 - 20:00:00
   *
   * @constructor
   * @param {?string} [message]
   * @param {?string[]} [_params]
   */
  constructor (message?: string, _params?: string[]) {
    super((message || 'invalid parameters') + (_params && _params.length > 0 ? ' - parameters :' + _params.join(', '): ''));
  }

}