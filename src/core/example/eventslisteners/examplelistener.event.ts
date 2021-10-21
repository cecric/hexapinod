import { logger } from '@dependencies/logger/logger';
import { BaseEventListener } from '@dependencies/hexapinod-framework/events/baseeventlistener';


/**
 * Example Listener to show how it works
 * @date 28/09/2021 - 08:52:21
 * @author cecric
 *
 * @export
 * @class ExampleListener
 * @typedef {ExampleListener}
 * @implements {BaseEventListener}
 */
export class ExampleListener implements BaseEventListener {


  /**
   * @inheritdoc
   * @date 28/09/2021 - 08:56:40
   * @author cecric
   *
   * @returns {string[]}
   */
  getManagedEvents(): string[] {
    return [
      ExampleListener.EVENT_DEFAULT_EXAMPLE
    ];
  }

  /**
   * @inheritdoc
   * @date 28/09/2021 - 08:56:47
   * @author cecric
   *
   * @param {string} _eventName
   * @param {unknown} _data
   * @returns {Promise<unknown>}
   */
  dispatch(_eventName: string, _data: unknown): Promise<unknown> {
    switch (_eventName) {
    case ExampleListener.EVENT_DEFAULT_EXAMPLE: {
      logger.log('Event default: ' , _data);
      break;
    }
    default:
      break;
    }
    return new Promise((_resolve) => {
      _resolve(_data);
    });
  }


  /**
   * Example event
   * @date 28/09/2021 - 08:56:59
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_DEFAULT_EXAMPLE = 'EVENT_DEFAULT_EXAMPLE';



}