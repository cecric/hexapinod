
/**
 * Access denied exception. Used by express middleware to send a 401 HTTP error.
 * @date 20/09/2021 - 20:00:00
 * @author cecric
 *
 * @export
 * @class AccessDeniedException
 * @typedef {AccessDeniedException}
 * @extends {Error}
 */
export class AccessDeniedException extends Error {

  /**
   * Creates an instance of AccessDeniedException.
   * @date 20/09/2021 - 20:00:00
   * @author cecric
   *
   * @constructor
   * @param {?string} [message]
   */
  constructor (message?: string) {
    super(message || 'access denied to the resource');
  }

}