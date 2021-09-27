import terminal from '@dependencies/terminal/terminal';
import { BaseEventListener } from '@dependencies/hexapinod-framework/events/baseeventlistener';


export default class ExampleListener implements BaseEventListener {

  getManagedEvents(): string[] {
    return [
      ExampleListener.EVENT_DEFAULT_EXAMPLE
    ];
  }

  dispatch(_eventName: string, _data: unknown): Promise<unknown> {
    switch (_eventName) {
    case ExampleListener.EVENT_DEFAULT_EXAMPLE: {
      terminal.log('Event default: ' , _data);
      break;
    }
    default:
      break;
    }
    return new Promise((_resolve) => {
      _resolve(_data);
    });
  }

  public static EVENT_DEFAULT_EXAMPLE = 'EVENT_DEFAULT_EXAMPLE';



}