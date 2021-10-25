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

/**
 * Credentials Parameters Model
 * @typedef {object} Credentials
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */

/**
 * Refresh Token Parameters Model
 * @typedef {object} RefreshToken
 * @property {string} token - A refresh token to be used to refresh and get a new token without password.
 */

/**
 * Token Result Model
 * @typedef {object} Token
 * @property {string} token - The main token to communicate
 * @property {string} refresh_token - A refresh token to be used to refresh and get a new token without password.
 */

/**
 * POST /authorize
 * @tags JWTAuth
 * @summary Authorize with the login/password
 * @param {Credentials} request.body.required - credentials info to perform log-in - application/json
 * @return {Token} 200 - success response - application/json
 *
 * @api {post} /authorize  Authorize with the login/password
 * @apiName authorize
 * @apiGroup JWTAuth
 * @apiSuccess (200) {Token} the tokens
 */
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

/**
 * POST /refresh
 * @tags JWTAuth
 * @summary Refresh authorization with the refresh_token
 * @param {RefreshToken} request.body.required - refresh token info - application/json
 * @return {Token} 200 - success response - application/json
 *
 * @api {post} /refresh Refresh authorization with the refresh_token
 * @apiName refresh
 * @apiGroup JWTAuth
 * @apiSuccess (200) {Token} token the token
 */
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