
/**
 * Generic exception. Used by express middleware to send a 500 HTTP error.
 * @date 20/09/2021 - 20:00:00
 *
 * @export
 * @class GenericException
 * @typedef {GenericException}
 * @extends {Error}
 */
export class GenericException extends Error {

  /**
   * The details of the error (used for logs)
   * @date 20/09/2021 - 20:00:00
   *
   * @protected
   * @type {*}
   */
  protected details: any;

  /**
   * Creates an instance of GenericException.
   * @date 20/09/2021 - 20:00:00
   *
   * @constructor
   * @param {?string} [_message]
   * @param {?unknown} [_details]
   */
  constructor (_message?: string, _details?: unknown) {
    super(_message || 'internal error');
    this.details = _details;
  }

  /**
   * get the details of error
   * @date 20/09/2021 - 20:00:00
   *
   * @public
   * @returns {*} the details
   */
  public getDetails (): any {
    return this.details;
  }

}