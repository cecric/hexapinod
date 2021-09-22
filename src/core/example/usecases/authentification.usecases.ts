import AuthentificationListener from '@core/example/events/eventslisteners/authentificationlistener.event';
import { EventsManager } from '@core/hexapinod/events/eventsmanager';
import { IUser } from '@core/example/interfaces/models/user.interface';
import terminal from '@lib/terminal/terminal';

export class AuthentificationUsecases {

  public static async loginUser(_email: string, _password: string, _networkInfo: Array<string>): Promise<IUser> {
    await EventsManager.getInstance().asyncDispatch(AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN_ATTEMPT, {'email': _email, 'password': _password, 'networkInfo': _networkInfo});
    throw new Error('to be implemented');
    const user: IUser = null;
    await EventsManager.getInstance().asyncDispatch(AuthentificationListener.EVENT_AUTHENTIFICATION_LOGIN, {'user': user, 'networkInfo': _networkInfo});
  }

  public static refreshUserById(_uid: number, _networkInfo: Array<string>): Promise<IUser> {
    terminal.log('Attempt refresh authentification for user id: ' + _uid + ' (connexion from: ' + _networkInfo.join(', ') + ')');
    throw new Error('to be implemented');
  }

}