

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