
/**
 * Not Found exception. Used by express middleware to send a 404 HTTP error.
 * @date 20/09/2021 - 20:00:00
 *
 * @export
 * @class NotFoundException
 * @typedef {NotFoundException}
 * @extends {Error}
 */
export class NotFoundException extends Error {

  /**
   * Creates an instance of NotFoundException.
   * @date 20/09/2021 - 20:00:00
   *
   * @constructor
   * @param {?string} [message]
   */
  constructor (message?: string) {
    super(message || 'resource not found');
  }

}