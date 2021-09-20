import * as fs from 'fs';
import { BaseEventListener } from './baseeventlistener';
import terminal from '@lib/terminal/terminal';


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
    this.readPath();
  }

  protected async readPath (): Promise<void> {
    terminal.info('[events manager] load events listeners...');
    const eventListenerSociete = fs.readdirSync(__dirname + '/eventslisteners');
    for (let i = 0; i < eventListenerSociete.length; i++) {
      if (eventListenerSociete[i].indexOf('.event') !== -1) {
        terminal.info('Load listener ' + eventListenerSociete[i]);
        // const eventListenerSocieteName = eventListenerSociete[i].substr(0, eventListenerSociete[i].indexOf('.event'));
        const moduleEventListener = await import(__dirname + '/eventslisteners/' + eventListenerSociete[i]);
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
    terminal.success('[events manager] events listeners successfully loaded');
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