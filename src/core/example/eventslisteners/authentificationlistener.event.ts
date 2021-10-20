import { IUser } from '@core/example/interfaces/models/user.interface';
import { logger } from '@dependencies/logger/logger';
import { BaseEventListener } from '@dependencies/hexapinod-framework/events/baseeventlistener';


export default class AuthentificationListener implements BaseEventListener {

  getManagedEvents(): string[] {
    return [
      AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT,
      AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN
    ];
  }

  dispatch(_eventName: string, _data: unknown): Promise<unknown> {
    switch (_eventName) {
    case AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT: {
      const email = _data['email'];
      const password = _data['password'];
      const networkInfo = _data['networkInfo'];
      logger.log('Attempt authentification: ' + email + ' - ' + password.replace(/./g,'*') + ' (connexion from: ' + networkInfo.join(', ') + ')');
      break;
    }
    case AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN: {
      const user: IUser = _data['user'] as IUser;
      const networkInfo = _data['networkInfo'];
      logger.log('Authentification successfull: ' + user.getEmail() + ' (connexion from: ' + networkInfo.join(', ') + ')');
      break;
    }
    default:
      break;
    }
    return new Promise((_resolve) => {
      _resolve(_data);
    });
  }

  public static EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT = 'EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT';
  public static EVENT_AUTHENTIFICATION_LOGIN = 'EVENT_AUTHENTIFICATION_LOGIN';



}