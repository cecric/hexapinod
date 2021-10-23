import { AuthentificationListener } from '@core/example/eventslisteners/authentificationlistener.event';
import { EventsManager } from '@dependencies/hexapinod-framework/events/eventsmanager';
import { IUser } from '@core/example/interfaces/models/user.interface';
import { logger } from '@dependencies/logger/logger';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';

/**
 * Base Authentification usecases. Should be implemented by your own service to log in an user.
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class AuthentificationUsecases
 * @typedef {AuthentificationUsecases}
 * @extends {UseCases}
 */
export class AuthentificationUsecases extends UseCases {

  /**
   * Login action to perform an user log in
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @param {string} _email
   * @param {string} _password
   * @param {Array<string>} _networkInfo
   * @returns {Promise<IUser>}
   */
  public static async loginUser(_email: string, _password: string, _networkInfo: Array<string>): Promise<IUser> {
    await EventsManager.asyncDispatch(AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT, {'email': _email, 'password': _password, 'networkInfo': _networkInfo});
    throw new Error('to be implemented');
    const user: IUser = null;
    await EventsManager.asyncDispatch(AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN, {'user': user, 'networkInfo': _networkInfo});
  }

  /**
   * Refresh an user by id (ensure the id exists)
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @param {number} _uid
   * @param {Array<string>} _networkInfo
   * @returns {Promise<IUser>}
   */
  public static refreshUserById(_uid: number, _networkInfo: Array<string>): Promise<IUser> {
    logger.log('Attempt refresh authentification for user id: ' + _uid + ' (connexion from: ' + _networkInfo.join(', ') + ')');
    throw new Error('to be implemented');
  }

}