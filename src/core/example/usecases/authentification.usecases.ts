import AuthentificationListener from '@core/example/eventslisteners/authentificationlistener.event';
import { EventsManager } from '@dependencies/hexapinod-framework/events/eventsmanager';
import { IUser } from '@core/example/interfaces/models/user.interface';
import { logger } from '@dependencies/logger/logger';
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';

export class AuthentificationUsecases extends UseCases {

  public static async loginUser(_email: string, _password: string, _networkInfo: Array<string>): Promise<IUser> {
    await EventsManager.getInstance().asyncDispatch(AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT, {'email': _email, 'password': _password, 'networkInfo': _networkInfo});
    throw new Error('to be implemented');
    const user: IUser = null;
    await EventsManager.getInstance().asyncDispatch(AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN, {'user': user, 'networkInfo': _networkInfo});
  }

  public static refreshUserById(_uid: number, _networkInfo: Array<string>): Promise<IUser> {
    logger.log('Attempt refresh authentification for user id: ' + _uid + ' (connexion from: ' + _networkInfo.join(', ') + ')');
    throw new Error('to be implemented');
  }

}