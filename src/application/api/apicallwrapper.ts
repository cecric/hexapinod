

/**
 * Wrapper of call to manage the handle of exception
 * @date 28/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @param {Function} _callback
 * @returns {(_req: unknown, _res: unknown, _next: any) => any}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function apiCallWrapper(_callback: Function) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return async function (_req: unknown, _res: unknown, _next: Function): Promise<void> {
    try {
      await _callback(_req, _res, _next);
      return;
    } catch (e) {
      _next(e);
    }
  };
}