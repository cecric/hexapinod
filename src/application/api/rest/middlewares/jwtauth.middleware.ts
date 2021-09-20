import { AccessDeniedException } from '@core/exceptions/accessdenied.exception';
import { IUser } from '@core/interfaces/models/user.interface';
import { AuthentificationUsecases } from '@core/usecases/authentification.usecases';
import terminal from '@lib/terminal/terminal';
import express from 'express';
import jwt from 'jsonwebtoken';

const jwtKey = process.env.SECRET_KEY_JWT;
const app = express.Router();


app.use(function (_req, _res, _next) {
  const filter = true;
  if (!filter) {
    _next();
    return;
  }
  if(_req.headers['authorization'] && _req.headers['authorization'].length > 7) {
    // bearer token example : "Bearer 6748865DEA42E234492B8C803E27D7645C4FC8E130C672A015A56303A6A4AFD6")
    const token = _req.headers['authorization'].substr(7);
    jwt.verify(token, jwtKey, async function(_err, _decoded) {
      if(_err) {
        _next(new AccessDeniedException(_err && _err.name && _err.name === 'TokenExpiredError' ? 'token expired' : 'invalid token'));
      } else {
        let user: IUser = null;
        try {
          _req['session'] = _decoded;
          _req['session']['public_ip'] = (_req.ip || _req.socket.remoteAddress).replace('::ffff:','');
          const networkInfo: Array<string> = [_req.ip || _req.socket.remoteAddress];
          if(_req.headers['origin'] && _req.headers['origin'].length>0){
            networkInfo.push(_req.headers['origin']);
          }
          user = await AuthentificationUsecases.refreshUserById(_decoded.id, networkInfo);
        } catch (e) {
          _next(e);
          return;
        }
        if (user === null) {
          terminal.error('Error while retrieving user');
          _next(new AccessDeniedException('user doesn\'t exist anymore, abort request'));
        }
        _req['session']['user'] = user;
        _next();
      }

    });
    return;
  }
  _next(new AccessDeniedException('invalid token'));
});

export default app;