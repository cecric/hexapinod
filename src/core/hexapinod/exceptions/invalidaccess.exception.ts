
/**
 * Invalid access exception. Used by express middleware to send a 403 HTTP error.
 * @date 20/09/2021 - 20:00:00
 * @author cecric
 *
 * @export
 * @class InvalidAccessException
 * @typedef {InvalidAccessException}
 * @extends {Error}
 */
export class InvalidAccessException extends Error {

  /**
   * Creates an instance of InvalidAccessException.
   * @date 20/09/2021 - 20:00:00
   * @author cecric
   *
   * @constructor
   * @param {?string} [message]
   */
  constructor (message?: string) {
    super(message || 'user need granted to access ressource');
  }

}