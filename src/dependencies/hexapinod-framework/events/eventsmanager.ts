import * as fs from 'fs';
import { BaseEventListener } from './baseeventlistener';
import terminal from '@dependencies/terminal/terminal';


export class EventsManager {

  private static instance: EventsManager = null;

  protected globalEventsListener: Record<string,BaseEventListener[]>;

  public static getInstance (): EventsManager {
    if (EventsManager.instance === null || EventsManager.instance === undefined) {
      EventsManager.instance = new EventsManager();
    }
    return EventsManager.instance;
  }

  private constructor () {
    // nothing to do
    this.initializeListenersBundle();
  }

  protected async initializeListenersBundle (): Promise<boolean> {
    terminal.info('[events manager] load events listeners...');
    const list = fs.readdirSync(__dirname + '/../../../core/', { withFileTypes: true });
    for (let i = 0; i < list.length; i++) {
      if (list[i].isDirectory()) {
        terminal.info('load bundle ' + list[i].name + ' listeners' );
        await this.readPath (list[i].name + '/eventslisteners/');
      }
    }
    terminal.success('[events manager] events successfully loaded');
    return true;
  }

  protected async readPath (_bundlePath: string): Promise<void> {
    if (!fs.existsSync(__dirname + '/../../../core/' + _bundlePath)) {
      return;
    }
    const eventListenerSociete = fs.readdirSync(__dirname + '/../../../core/' + _bundlePath);
    for (let i = 0; i < eventListenerSociete.length; i++) {
      if (eventListenerSociete[i].indexOf('.event') !== -1) {
        terminal.info('Load listener ' + eventListenerSociete[i]);
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