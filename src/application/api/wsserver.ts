
import { logger } from '@dependencies/logger/logger';
import { Server, Socket } from 'socket.io';
import https from 'https';
import http from 'http';
import { EventsManager } from '@dependencies/hexapinod-framework/events/eventsmanager';
import { WebSocketsListener } from '@core/example/eventslisteners/websocketslistener.event';


class WSServer {


  protected static instance: WSServer;

  protected ioServer: Server;

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

  protected constructor() {
    // do nothing
  }

  /**
   * Handle the socket event for Socket.io
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {unknown} _socket
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async onSocketServer(_socket: Socket): Promise<void> {
    logger.info('socket.io: socket connected');
    await EventsManager.asyncDispatch(WebSocketsListener.EVENT_WSS_CONNECT_SOCKET, {'socket': _socket});
    _socket.on('disconnect', async () => {
      await EventsManager.asyncDispatch(WebSocketsListener.EVENT_WSS_DISCONNECT_SOCKET, {'socket': _socket});

    });
    // TODO handle the socket event
  }

  public subscribeToRoom (_socket: Socket, _roomName: string): boolean {
    if (!this.ioServer) {
      return false;
    }
    _socket.to(_roomName);
    return true;
  }

  public sendMessageToSocket (_socket: Socket, _message: string): boolean {
    if (!this.ioServer) {
      return false;
    }
    return _socket.emit(_message);
  }

  public broadcastMessage (_message: string): boolean {
    if (!this.ioServer) {
      return false;
    }
    return this.ioServer.emit(_message);
  }

  public sendMessageToRoom (_roomName: string, _message: string): boolean {
    if (!this.ioServer) {
      return false;
    }
    return this.ioServer.to(_roomName).emit(_message);
  }

  public launchSocketServer (httpsServer: https.Server | http.Server): https.Server | http.Server {
    this.ioServer = new Server(httpsServer);
    this.ioServer.on('connection', this.onSocketServer );
    return httpsServer;
  }
}


export const WebSocketServer = WSServer.getInstance();