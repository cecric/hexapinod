

/**
 * Base event listener, all event listener must inherit of this class
 * @date 20/09/2021 - 08:00:00
 *
 * @export
 * @interface BaseEventListener
 * @typedef {BaseEventListener}
 */
export interface BaseEventListener {

  /**
   * returns the managed events by the listener (used to register it automatically)
   * @date 20/09/2021 - 08:00:00
   *
   * @returns {string[]} the managed event
   */
  getManagedEvents (): string[];

  /**
   * Function called to handle the event.
   * @date 20/09/2021 - 08:00:00
   *
   * @param {string} _eventName
   * @param {unknown} _data
   * @returns {(Promise<unknown | boolean>)}
   */
  dispatch (_eventName: string, _data: unknown): Promise<unknown | boolean>;

}