import { logger } from '@dependencies/logger/logger';
import { Request, Response } from 'express';
import { InvalidAccessException } from '@core/hexapinod/exceptions/invalidaccess.exception';
import { NotFoundException } from '@core/hexapinod/exceptions/notfound.exception';
import { InvalidParametersException } from '@core/hexapinod/exceptions/invalidparameters.exception';
import { NoContentException } from '@core/hexapinod/exceptions/nocontent.exception';
import { AccessDeniedException } from '@core/hexapinod/exceptions/accessdenied.exception';

/**
 * Handle exceptions to return a correct error message and http code, and log it
 * Not remove the _next parameter, it is required to catch the error
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @param {unknown} _err
 * @param {Request} _req
 * @param {Response} _res
 * @param {unknown} _next
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(_err: unknown, _req: Request, _res: Response, _next: unknown): void {
  if (_err && _err instanceof NoContentException) {
    _res.sendStatus(204);
    return;
  }
  logger.error(_req.method + ' ' + _req.originalUrl + ' - ' + (_err['message'] ? _err['message'] : _err));
  if (_err) {
    const errorObject = {
      'error': 'internal error'
    };
    if (process.env.ENVIRONNEMENT === 'dev') {
      errorObject['stack'] = _err['stack'].split('\n');
    }
    errorObject['message'] = _err['message'];
    if (_err instanceof AccessDeniedException) {
      errorObject['error'] = 'access denied';
      _res.status(401).send(errorObject);
      return;
    }
    if (_err instanceof InvalidAccessException) {
      errorObject['error'] = 'access not granted';
      _res.status(403).send(errorObject);
      return;
    }
    if (_err instanceof InvalidParametersException) {
      errorObject['error'] = 'invalid request';
      logger.error(errorObject);
      logger.error(_err.stack);
      // errorObject['error_params'] = err.getErrorParameters();
      _res.status(400).send(errorObject);
      return;
    }
    if (_err instanceof NotFoundException) {
      errorObject['error'] = 'resource not found';
      _res.status(404).send(errorObject);
      return;
    }
    logger.error(errorObject);
    logger.error(_err['stack']);
    if (_err['sql']) {
      logger.error(_err['sql']);
    }
    _res.status(500).send(errorObject);
    return;
  }
  _res.status(500).send({'error': 'undefined error'});
}