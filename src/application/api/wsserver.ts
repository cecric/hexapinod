
import { logger } from '@dependencies/logger/logger';
import { Server, Socket } from 'socket.io';
import https from 'https';
import http from 'http';
import { EventsManager } from '@dependencies/hexapinod-framework/events/eventsmanager';
import { WebSocketsListener } from '@core/example/eventslisteners/websocketslistener.event';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { ConfigurationReader } from '@dependencies/configuration-reader/configurationreader';


class WSServer {


  /**
   * The instance of the WSServer singleton
   * @date 30/12/2021 - 12:09:34
   * @author cecric
   *
   * @protected
   * @static
   * @type {WSServer}
   */
  protected static instance: WSServer;


  /**
   * The Socket.io server instance
   * @date 30/12/2021 - 12:09:50
   * @author cecric
   *
   * @protected
   * @type {Server}
   */
  protected ioServer: Server;

  /**
   * Configuration WS Server
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {Record<string, unknown>}
   */
   protected configuration: Record<string, unknown>;

   /**
   * returns the instance of the singleton.
   * @date 22/09/2021 - 08:00:00
   *
   * @public
   * @static
   * @returns {WSServer}
   */
   public static getInstance (): WSServer {
     if (!WSServer.instance) {
       WSServer.instance = new WSServer();
     }
     return WSServer.instance;
   }

   /**
    * Creates an instance of WSServer.
    * @date 30/12/2021 - 12:10:11
    * @author cecric
    *
    * @constructor
    * @protected
    */
   protected constructor() {
     this.configuration = ConfigurationReader.getConfiguration('application/api/wsserver') as Record<string, unknown>;
   }

   /**
   * Handle the socket event for Socket.io
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {Socket} _socket the socket of the client
   */
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected async onSocketServer(_socket: Socket): Promise<void> {
     logger.info('socket.io: socket connected');
     await EventsManager.asyncDispatch(WebSocketsListener.EVENT_WSS_CONNECT_SOCKET, {'socket': _socket});
     _socket.on('disconnecting', async () => {
       await EventsManager.asyncDispatch(WebSocketsListener.EVENT_WSS_DISCONNECTING_SOCKET, {'socket': _socket});
     });
     _socket.on('disconnect', async () => {
       await EventsManager.asyncDispatch(WebSocketsListener.EVENT_WSS_DISCONNECT_SOCKET, {'socket': _socket});
     });
     WebSocketsListener.AVAILABLE_CUSTOM_EVENTS.forEach((_eventName) => {
       _socket.on(_eventName, async (...params: unknown[]) => {
         await EventsManager.asyncDispatch(WebSocketsListener.EVENT_WSS_CUSTOM_EVENT, {'event_name': _eventName, 'socket': _socket, 'parameters': params});
       });
     });
   }


   /**
    * Force the disconnection of a socket
    * @date 30/12/2021 - 12:10:21
    * @author cecric
    *
    * @public
    * @param {Socket} _socket the socket of the client
    * @returns {boolean} true if success, false if not
    */
   public disconnectSocket (_socket: Socket): boolean {
     if (!this.ioServer) {
       return false;
     }
     _socket.disconnect(true);
     return true;
   }


   /**
    * Force the disconnection of all the sockets from a room
    * @date 30/12/2021 - 13:50:06
    * @author cecric
    *
    * @public
    * @param {string} _roomName the room to disconnect
    * @returns {boolean} true if success, false if not
    */
   public disconnectSocketsFromRoom (_roomName: string): boolean {
     if (!this.ioServer) {
       return false;
     }
     this.ioServer.in(_roomName).disconnectSockets(true);
     return true;
   }


   /**
    * Subscribe a socket into a room
    * @date 30/12/2021 - 13:50:26
    * @author cecric
    *
    * @public
    * @param {Socket} _socket the socket of the client
    * @param {(string | Array<string>)} _roomName the room to put inside
    * @returns {boolean} true if success, false if not
    */
   public subscribeToRoom (_socket: Socket, _roomName: string | Array<string>): boolean {
     if (!this.ioServer) {
       return false;
     }
     _socket.join(_roomName);
     return true;
   }


   /**
    * Subscribe all the currently connected sockets to a room
    * @date 30/12/2021 - 13:50:43
    * @author cecric
    *
    * @public
    * @param {(string | Array<string>)} _roomName the room name to join all the sockets
    * @returns {boolean} true if success, false if not
    */
   public subscribeAllToRoom (_roomName: string | Array<string>): boolean {
     if (!this.ioServer) {
       return false;
     }
     this.ioServer.socketsJoin(_roomName);
     return true;
   }


   /**
    * Unsubscribe a socket from a room
    * @date 30/12/2021 - 13:51:14
    * @author cecric
    *
    * @public
    * @param {Socket} _socket the socket of the client
    * @param {string} _roomName the room name to unsubscribe
    * @returns {boolean} true if success, false if not
    */
   public unsubscribeFromRoom (_socket: Socket, _roomName: string): boolean {
     if (!this.ioServer) {
       return false;
     }
     _socket.leave(_roomName);
     return true;
   }


   /**
    * Unsubscribe all the socket from a room
    * @date 30/12/2021 - 13:51:28
    * @author cecric
    *
    * @public
    * @param {(string | Array<string>)} _roomName the room name(s) to unsubscribe
    * @returns {boolean} true if success, false if not
    */
   public unsubscribeAllFromRoom (_roomName: string | Array<string>): boolean {
     if (!this.ioServer) {
       return false;
     }
     this.ioServer.socketsLeave(_roomName);
     return true;
   }


   /**
    * Send an event message to a specific socket
    * @date 30/12/2021 - 13:51:55
    * @author cecric
    *
    * @public
    * @param {Socket} _socket the socket of the client
    * @param {string} _message the message to send
    * @param {unknown} [_payload=undefined] extra informations to send
    * @returns {boolean} true if success, false if not
    */
   public sendMessageToSocket (_socket: Socket, _message: string, _payload: unknown = undefined): boolean {
     if (!this.ioServer) {
       return false;
     }
     return _socket.emit(_message, _payload);
   }


   /**
    * Broadcast an event message to all the sockets
    * @date 30/12/2021 - 13:52:17
    * @author cecric
    *
    * @public
    * @param {string} _message the message to send
    * @param {unknown} [_payload=undefined] extra informations to send
    * @returns {boolean} true if success, false if not
    */
   public broadcastMessage (_message: string, _payload: unknown = undefined): boolean {
     if (!this.ioServer) {
       return false;
     }
     return this.ioServer.emit(_message, _payload);
   }


   /**
    * Broadcast an event message to all the sockets from a room
    * @date 30/12/2021 - 13:52:41
    * @author cecric
    *
    * @public
    * @param {string} _roomName the room name concerned
    * @param {string} _message the message to send
    * @param {unknown} [_payload=undefined] extra informations to send
    * @returns {boolean} true if success, false if not
    */
   public sendMessageToRoom (_roomName: string, _message: string, _payload: unknown = undefined): boolean {
     if (!this.ioServer) {
       return false;
     }
     return this.ioServer.to(_roomName).emit(_message, _payload);
   }


   /**
    * Launch the socket server, link it to redis if needed and connect it to the http or https server instance
    * @date 30/12/2021 - 13:53:09
    * @author cecric
    *
    * @public
    * @param {(https.Server | http.Server)} httpsServer the http(s) server instance
    * @returns {(https.Server | http.Server)} the http(s) server instance connected to socket.io (or not if disabled)
    */
   public launchSocketServer (httpsServer: https.Server | http.Server): https.Server | http.Server {
     if (!this.configuration['enabled']) {
       return httpsServer;
     }
     this.ioServer = new Server(httpsServer);
     if (this.configuration['path'] && typeof this.configuration['path'] === 'string') {
       this.ioServer.path(this.configuration['path'] as string);
     }
     if (this.configuration['redis'] && this.configuration['redis']['host'] && this.configuration['redis']['port']) {
       const redisConf = this.configuration['redis'];
       const pubClient = createClient(redisConf);
       const subClient = pubClient.duplicate();
       this.ioServer.adapter(createAdapter(pubClient, subClient));
       logger.info('websocket server link to redis initialized');
     }
     this.ioServer.on('connection', this.onSocketServer );
     logger.info('websocket server initialized');
     return httpsServer;
   }
}


export const WebSocketServer = WSServer.getInstance();