import { logger } from '@dependencies/logger/logger';
import { BaseEventListener } from '@dependencies/hexapinod-framework/events/baseeventlistener';
import { WebSocketServer } from '@application/api/wsserver';


/**
 * WebSockets Listener to manage event with the WebSocket Socket.io server.
 * It makes the link with application part and the class WSServer.
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
   * @returns {string[]} the list of managed event by the listener
   */
  getManagedEvents(): string[] {
    return [
      WebSocketsListener.EVENT_WSS_CONNECT_SOCKET,
      WebSocketsListener.EVENT_WSS_DISCONNECT_SOCKET,
      WebSocketsListener.EVENT_WSS_DISCONNECTING_SOCKET,
      WebSocketsListener.EVENT_WSS_CLOSE_SOCKET,
      WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_SOCKET,
      WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_ALL,
      WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_ROOM,
      WebSocketsListener.EVENT_WSS_SUBSCRIBE_TO_ROOM,
      WebSocketsListener.EVENT_WSS_UNSUBSCRIBE_FROM_ROOM,
      WebSocketsListener.EVENT_WSS_CUSTOM_EVENT
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
      logger.log('Event "connect" on socket: ' , _data);
      break;
    }
    case WebSocketsListener.EVENT_WSS_DISCONNECTING_SOCKET: {
      logger.log('Event "disconnecting" on socket: ' , _data);
      break;
    }
    case WebSocketsListener.EVENT_WSS_DISCONNECT_SOCKET: {
      logger.log('Event "disconnect" on socket: ' , _data);
      break;
    }
    case WebSocketsListener.EVENT_WSS_CLOSE_SOCKET: {
      logger.log('Close specific socket: ' , _data);
      WebSocketServer.disconnectSocket(_data['socket']);
      break;
    }
    case WebSocketsListener.EVENT_WSS_CUSTOM_EVENT: {
      logger.log('Custom event received on socket: ' , _data['event_name'], _data['parameters'], _data['socket']);
      break;
    }
    case WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_SOCKET: {
      logger.log('Send a message to a specific socket: ' , _data);
      WebSocketServer.sendMessageToSocket(_data['socket'], _data['message'], _data['payload']);
      break;
    }
    case WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_ALL: {
      logger.log('Send a message to everybody (broadcast message): ' , _data);
      WebSocketServer.broadcastMessage(_data['message'], _data['payload']);
      break;
    }
    case WebSocketsListener.EVENT_WSS_SEND_MESSAGE_TO_ROOM: {
      logger.log('Send a message to the room: ' , _data);
      WebSocketServer.sendMessageToRoom(_data['room'], _data['message'], _data['payload']);
      break;
    }
    case WebSocketsListener.EVENT_WSS_SUBSCRIBE_TO_ROOM: {
      logger.log('Subscribe socket to room: ' , _data);
      WebSocketServer.subscribeToRoom(_data['socket'], _data['room']);
      break;
    }
    case WebSocketsListener.EVENT_WSS_UNSUBSCRIBE_FROM_ROOM: {
      logger.log('Unscribe socket from room: ' , _data);
      WebSocketServer.unsubscribeFromRoom(_data['socket'], _data['room']);
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
   * Static function to add custom events to listen and broadcast
   * @date 30/12/2021 - 12:04:11
   * @author cecric
   *
   * @public
   * @static
   * @param {string} _eventName the custom event name to subscribe for websockets events
   */
  public static addANewCustomEventAvailable (_eventName: string): void {
    WebSocketsListener.AVAILABLE_CUSTOM_EVENTS.push(_eventName);
  }


  /**
   * Custom event list to listen and emit with EVENT_WSS_CUSTOM_EVENT
   * @date 30/12/2021 - 12:00:15
   * @author cecric
   *
   * @public
   * @static
   * @type {Array<string>}
   */
  public static AVAILABLE_CUSTOM_EVENTS: Array<string> = [];



  /**
   * Event on a new socket connected
   * @date 28/09/2021 - 08:56:59
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_CONNECT_SOCKET = 'EVENT_WSS_CONNECT_SOCKET';


  /**
   * Event on a socket disconnected
   * @date 30/12/2021 - 11:54:42
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_DISCONNECT_SOCKET = 'EVENT_WSS_DISCONNECT_SOCKET';


  /**
   * Event on a socket disconnecting (will be disconnected)
   * @date 30/12/2021 - 11:55:17
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_DISCONNECTING_SOCKET = 'EVENT_WSS_DISCONNECTING_SOCKET';


  /**
   * Force close a socket
   * @date 30/12/2021 - 11:54:42
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_CLOSE_SOCKET = 'EVENT_WSS_CLOSE_SOCKET';


  /**
   * Event to send a message to a specific socket (client)
   * @date 30/12/2021 - 11:59:11
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_SEND_MESSAGE_TO_SOCKET = 'EVENT_WSS_SEND_MESSAGE_TO_SOCKET';


  /**
   * Event to broadcast a message to everybody
   * @date 30/12/2021 - 11:58:56
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_SEND_MESSAGE_TO_ALL = 'EVENT_WSS_SEND_MESSAGE_TO_ALL';


  /**
   * Event to send a message to a room
   * @date 30/12/2021 - 11:58:41
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_SEND_MESSAGE_TO_ROOM = 'EVENT_WSS_SEND_MESSAGE_TO_ROOM';


  /**
   * Event to perform a socket subscription to a room
   * @date 30/12/2021 - 11:58:20
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_SUBSCRIBE_TO_ROOM = 'EVENT_WSS_SUBSCRIBE_TO_ROOM';


  /**
   * Event to perform a socket unscription from a room
   * @date 30/12/2021 - 11:56:21
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_UNSUBSCRIBE_FROM_ROOM = 'EVENT_WSS_UNSUBSCRIBE_FROM_ROOM';


  /**
   * Custom event emitted by the client (All the event to listen and emit should be added by using the static call addANewCustomEventAvailable)
   * @date 30/12/2021 - 11:55:46
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_WSS_CUSTOM_EVENT = 'EVENT_WSS_CUSTOM_EVENT';




}