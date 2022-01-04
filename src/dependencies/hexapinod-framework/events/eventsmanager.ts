import * as fs from 'fs';
import { BaseEventListener } from './baseeventlistener';
import { logger } from '@dependencies/logger/logger';

/**
 * Events manager, handle events and dispatch them to listeners
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @class EventsManagerTool
 * @typedef {EventsManagerTool}
 */
class EventsManagerTool {

  /**
   * Instance of the singleton
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @private
   * @static
   * @type {EventsManagerTool}
   */
  private static instance: EventsManagerTool = null;

  /**
   * The list of events listeners by name of events
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {Record<string,BaseEventListener[]>}
   */
  protected globalEventsListener: Record<string,BaseEventListener[]>;

  /**
   * Static function to return the instance of the singleton.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @returns {EventsManagerTool}
   */
  public static getInstance (): EventsManagerTool {
    if (EventsManagerTool.instance === null || EventsManagerTool.instance === undefined) {
      EventsManagerTool.instance = new EventsManagerTool();
    }
    return EventsManagerTool.instance;
  }

  /**
   * Creates an instance of EventsManagerTool.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @constructor
   * @private
   */
  private constructor () {
    // nothing to do
    this.initializeListenersBundle();
  }

  /**
   * Load the listeners from the bundles in core
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @async
   * @returns {Promise<boolean>}
   */
  protected async initializeListenersBundle (): Promise<boolean> {
    logger.info('[events manager] load events listeners...');
    const list = fs.readdirSync(new URL('.', import.meta.url).pathname + '../../../core/', { withFileTypes: true });
    for (let i = 0; i < list.length; i++) {
      if (list[i].isDirectory()) {
        logger.info('load bundle ' + list[i].name + ' listeners' );
        await this.readPath (list[i].name + '/eventslisteners/');
      }
    }
    logger.success('[events manager] events successfully loaded');
    return true;
  }

  /**
   * Load and init the listerners from a bundle
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @async
   * @param {string} _bundlePath
   * @returns {Promise<void>}
   */
  protected async readPath (_bundlePath: string): Promise<void> {
    if (!fs.existsSync(new URL('.', import.meta.url).pathname + '../../../core/' + _bundlePath)) {
      return;
    }
    const eventListenerSociete = fs.readdirSync(new URL('.', import.meta.url).pathname + '../../../core/' + _bundlePath);
    for (let i = 0; i < eventListenerSociete.length; i++) {
      if (eventListenerSociete[i].endsWith('.event.js') || eventListenerSociete[i].endsWith('.event.ts')) {
        logger.info('Load listener ' + eventListenerSociete[i]);
        const pathOfModule = new URL('.', import.meta.url).pathname + '../../../core/' + _bundlePath + eventListenerSociete[i];
        const moduleEventListener = await import(pathOfModule);
        const keyListeners = Object.keys(moduleEventListener);
        const keyListener = keyListeners.length > 0 ? keyListeners[0] : 'default';
        const eventListener: BaseEventListener = new moduleEventListener[keyListener]();
        for(const managedEvent of eventListener.getManagedEvents()){
          if (!this.globalEventsListener) {
            this.globalEventsListener = {} as Record<string,BaseEventListener[]>;
          }
          if (!this.globalEventsListener[managedEvent]) {
            this.globalEventsListener[managedEvent] = [];
          }
          this.globalEventsListener[managedEvent].push(eventListener);
        }
      }
    }
  }

  /**
   * Dispatch the event to the event listeners. (Async version)
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @async
   * @param {string} _eventName
   * @param {unknown} _data
   * @returns {Promise<unknown>}
   */
  public async asyncDispatch (_eventName: string, _data: unknown): Promise<unknown> {
    const results = {};
    results[_eventName] = [];
    if (this.globalEventsListener && this.globalEventsListener[_eventName]) {
      for (let i = 0; i < this.globalEventsListener[_eventName].length; i++) {
        const result = await this.globalEventsListener[_eventName][i].dispatch(_eventName, _data);
        results[_eventName].push({'type': 'global', 'result' : result});
      }
    }
    return results;
  }

  /**
   * Dispatch the event to the event listeners without waiting the events listeners.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {string} _eventName
   * @param {unknown} _data
   * @returns {boolean}
   */
  public dispatch (_eventName: string, _data: unknown): boolean {
    if (this.globalEventsListener && this.globalEventsListener[_eventName]) {
      for (let i = 0; i < this.globalEventsListener[_eventName].length; i++) {
        this.globalEventsListener[_eventName][i].dispatch(_eventName, _data);
      }
    }
    return true;
  }
}

export type { EventsManagerTool };

/**
 * Instance of events manager
 * @date 21/10/2021 - 08:00:00
 *
 * @type {EventsManagerTool}
 */
export const EventsManager = EventsManagerTool.getInstance();