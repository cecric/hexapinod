
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
  const list = fs.readdirSync(new URL('.', import.meta.url).pathname + _path);
  for (let i = 0; i < list.length; i++) {
    const curname = _path + '/' + list[i];
    if (fs.existsSync(new URL('.', import.meta.url).pathname + curname) && fs.lstatSync(new URL('.', import.meta.url).pathname + curname).isDirectory()) {
      await initializeRoutes(_router, curname);
      continue;
    }
    if (!list[i].endsWith('.routes.ts') && !list[i].endsWith('.routes.js')) {
      continue;
    }
    logger.info('load route file ' + new URL('.', import.meta.url).pathname + curname);
    const routeModule = await import(new URL('.', import.meta.url).pathname + curname);
    const keysmodules = Object.keys(routeModule);
    const keymodule = keysmodules.length > 0 ? keysmodules[0] : 'default';
    _router.use(routeModule[keymodule]);
  }
  return _router;
}
