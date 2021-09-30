import express from 'express';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { AuthentificationUsecases } from '@core/example/usecases/authentification.usecases';
import { AccessDeniedException } from '@core/hexapinod/exceptions/accessdenied.exception';
import { IUser } from '@core/example/interfaces/models/user.interface';

const router = express.Router();

const jwtKey = process.env.SECRET_KEY_JWT;
const tokenLifetime = '1h';
const refreshTokenLifetime = '48h';



router.post('/authorize', async function (_req, _res, _next) {
  try {
    let user: IUser = null;
    const networkInfo: Array<string> = [_req.ip || _req.socket.remoteAddress];
    if (_req.body['email'] && _req.body['password']) {
      if(_req.headers['origin'] && _req.headers['origin'].length>0){
        networkInfo.push(_req.headers['origin']);
      }
      user = await AuthentificationUsecases.loginUser(_req.body['email'], _req.body['password'], networkInfo);
    }
    if(user === null) {
      _next(new AccessDeniedException('invalid credentials'));
      return null;
    }
    const datetimeLogin = DateTime.now().setZone('utc').setLocale('en').toFormat('yyyyMMddHHmmss');
    const token = jwt.sign({
      'email': user.getEmail(),
      'id': user.getId(),
      'dlog': datetimeLogin,
    }, jwtKey, { expiresIn: tokenLifetime });
      // 14400 pour test dev, 1800 pour user prod
    const refreshToken = jwt.sign({
      'id': user.getId(),
      'dlog': datetimeLogin
    }, jwtKey, { expiresIn: refreshTokenLifetime });
    return _res.status(200).json({
      'token': token,
      'refresh_token': refreshToken
    });
  } catch (e) {
    _next(e);
    return null;
  }
});

router.post('/refresh', function (_req, _res, _next) {
  if (_req.body && _req.body.token) {
    const networkInfo: Array<string> = [_req.ip || _req.socket.remoteAddress];
    if(_req.headers['origin'] && _req.headers['origin'].length>0){
      networkInfo.push(_req.headers['origin']);
    }
    jwt.verify(_req.body.token, jwtKey, async function(err, decoded) {
      if(err) {
        _next(new AccessDeniedException(err.name && err.name === 'TokenExpiredError' ? 'token expired' : 'invalid token'));
        return null;
      }
      try {
        let user: IUser = null;
        try {
          user = await AuthentificationUsecases.refreshUserById(decoded.id, networkInfo);
        } catch (e) {
          user = null;
        }
        if(user === null){
          _next(new AccessDeniedException('account not available anymore'));
          return null;
        }
        const token = jwt.sign({
          'email': user.getEmail(),
          'id': user.getId(),
          'dlog': decoded['dlog'],
        }, jwtKey, { expiresIn: tokenLifetime });
        // 14400 pour test dev, 1800 pour user prod
        const refreshToken = jwt.sign({
          'id': user.getId(),
          'dlog': decoded['dlog']
        }, jwtKey, { expiresIn: refreshTokenLifetime });
        _req['session'] = decoded;
        return _res.status(200).json({
          'token': token,
          'refresh_token': refreshToken
        });
      } catch (e) {
        _next(e);
        return null;
      }
    });
    return;
  }
  _next();
});


export default router;