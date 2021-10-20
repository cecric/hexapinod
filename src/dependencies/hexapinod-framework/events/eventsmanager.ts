import * as fs from 'fs';
import { BaseEventListener } from './baseeventlistener';
import { logger } from '@dependencies/logger/logger';

/**
 * Events manager, handle events and dispatch them to listeners
 * @date 20/09/2021 - 08:00:00
 *
 * @export
 * @class EventsManager
 * @typedef {EventsManager}
 */
export class EventsManager {

  /**
   * Instance of the singleton
   * @date 20/09/2021 - 08:00:00
   *
   * @private
   * @static
   * @type {EventsManager}
   */
  private static instance: EventsManager = null;

  /**
   * Description placeholder
   * @date 20/09/2021 - 08:00:00
   *
   * @protected
   * @type {Record<string,BaseEventListener[]>}
   */
  protected globalEventsListener: Record<string,BaseEventListener[]>;

  /**
   * Static function to return the instance of the singleton.
   * @date 20/09/2021 - 08:00:00
   *
   * @public
   * @static
   * @returns {EventsManager}
   */
  public static getInstance (): EventsManager {
    if (EventsManager.instance === null || EventsManager.instance === undefined) {
      EventsManager.instance = new EventsManager();
    }
    return EventsManager.instance;
  }

  /**
   * Creates an instance of EventsManager.
   * @date 20/09/2021 - 08:00:00
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
   *
   * @protected
   * @async
   * @returns {Promise<boolean>}
   */
  protected async initializeListenersBundle (): Promise<boolean> {
    logger.info('[events manager] load events listeners...');
    const list = fs.readdirSync(__dirname + '/../../../core/', { withFileTypes: true });
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
   *
   * @protected
   * @async
   * @param {string} _bundlePath
   * @returns {Promise<void>}
   */
  protected async readPath (_bundlePath: string): Promise<void> {
    if (!fs.existsSync(__dirname + '/../../../core/' + _bundlePath)) {
      return;
    }
    const eventListenerSociete = fs.readdirSync(__dirname + '/../../../core/' + _bundlePath);
    for (let i = 0; i < eventListenerSociete.length; i++) {
      if (eventListenerSociete[i].indexOf('.event') !== -1) {
        logger.info('Load listener ' + eventListenerSociete[i]);
        // const eventListenerSocieteName = eventListenerSociete[i].substr(0, eventListenerSociete[i].indexOf('.event'));
        const moduleEventListener = await import(__dirname + '/../../../core/' + _bundlePath + eventListenerSociete[i]);
        const eventListener: BaseEventListener = new moduleEventListener.default();
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

export default EventsManager.getInstance();