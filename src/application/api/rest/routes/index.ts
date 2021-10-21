
import { logger } from '@dependencies/logger/logger';
import {Router} from 'express';
import fs from 'fs';

/**
 * Initialize routes modules automatically by using filenames
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @async
 * @param {Router} _router
 * @param {string} [_path='']
 * @returns {Promise<any>}
 */
export async function initializeRoutes (_router: Router, _path = ''): Promise<any> {
  const list = fs.readdirSync(__dirname + '/' + _path);
  for (let i = 0; i < list.length; i++) {
    const curname = _path + '/' + list[i];
    if (fs.existsSync(__dirname + '/' + curname) && fs.lstatSync(__dirname + '/' + curname).isDirectory()) {
      await initializeRoutes(_router, curname);
      continue;
    }
    if (list[i].indexOf('.ts') === -1 || list[i].indexOf('.routes.ts') === -1) {
      continue;
    }
    logger.info('load route file ' + __dirname + curname);
    const routeModule = await import(__dirname + curname);
    const keysmodules = Object.keys(routeModule);
    const keymodule = keysmodules.length > 0 ? keysmodules[0] : 'default';
    _router.use(routeModule[keymodule]);
  }
  return _router;
}
