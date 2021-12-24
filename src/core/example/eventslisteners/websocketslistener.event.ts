import { logger } from '@dependencies/logger/logger';
import { BaseEventListener } from '@dependencies/hexapinod-framework/events/baseeventlistener';
import { WebSocketServer } from '@application/api/wsserver';


/**
 * Example Listener to show how it works
 * @date 28/09/2021 - 08:52:21
 * @author cecric
 *
 * @export
 * @class WebSocketsListener
 * @typedef {WebSocketsListener}
 * @implements {BaseEventListener}
 */
export class WebSocketsListener implements BaseEventListener {


  /**
   * @inheritdoc
   * @date 28/09/2021 - 08:56:40
   * @author cecric
   *
   * @returns {string[]}
   */
  getManagedEvents(): string[] {
    return [
      WebSocketsListener.EVENT_WSS_CONNECT_SOCKET,
      WebSocketsListener.EVENT_WSS_DISCONNECT_SOCKET,
      WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_SOCKET
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
    case WebSocketsListener.EVENT_WSS_CONNECT_SOCKET: {
      logger.log('Event connect socket: ' , _data);
      break;
    }
    case WebSocketsListener.EVENT_WSS_DISCONNECT_SOCKET: {
      logger.log('Event disconnect socket: ' , _data);
      break;
    }
    case WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_SOCKET: {
      logger.log('Event disconnect socket: ' , _data);
      WebSocketServer.sendMessageToSocket(_data['socket'], _data['message']);
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
   * @date 28/09/2021 - 08:56:59
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_CONNECT_SOCKET = 'EVENT_WSS_CONNECT_SOCKET';

  public static EVENT_WSS_DISCONNECT_SOCKET = 'EVENT_WSS_DISCONNECT_SOCKET';

  public static EVENT_WSS_SEND_MESSAGE_TO_SOCKET = 'EVENT_SEND_MESSAGE_TO_SOCKET';



}