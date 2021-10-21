import { IUser } from '@core/example/interfaces/models/user.interface';
import { logger } from '@dependencies/logger/logger';
import { BaseEventListener } from '@dependencies/hexapinod-framework/events/baseeventlistener';


/**
 * Authentification Listener Sample, you can override or rewrite it
 * to perform action on login
 * @date 20/09/2021 - 08:52:48
 * @author cecric
 *
 * @export
 * @class AuthentificationListener
 * @typedef {AuthentificationListener}
 * @implements {BaseEventListener}
 */
export class AuthentificationListener implements BaseEventListener {


  /**
   * @inheritdoc
   * @date 20/09/2021 - 08:53:43
   * @author cecric
   *
   * @returns {string[]}
   */
  getManagedEvents(): string[] {
    return [
      AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT,
      AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN
    ];
  }

  /**
   * @inheritdoc
   * @date 20/09/2021 - 08:54:44
   * @author cecric
   *
   * @param {string} _eventName
   * @param {unknown} _data
   * @returns {Promise<unknown>}
   */
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


  /**
   * Event on attempted login
   * @date 20/09/2021 - 08:55:04
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT = 'EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT';


  /**
   * Event on Logged in
   * @date 20/09/2021 - 08:55:17
   * @author cecric
   *
   * @public
   * @static
   * @type {string}
   */
  public static EVENT_AUTHENTIFICATION_LOGIN = 'EVENT_AUTHENTIFICATION_LOGIN';



}