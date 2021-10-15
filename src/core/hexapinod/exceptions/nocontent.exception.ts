
/**
 * No content exception. Used by express middleware to send a 204 success with no content.
 * @date 20/09/2021 - 20:00:00
 *
 * @export
 * @class NoContentException
 * @typedef {NoContentException}
 * @extends {Error}
 */
export class NoContentException extends Error {

  /**
   * Creates an instance of NoContentException.
   * @date 20/09/2021 - 20:00:00
   *
   * @constructor
   * @param {?string} [message]
   */
  constructor (message?: string) {
    super(message || 'no resource');
  }

}