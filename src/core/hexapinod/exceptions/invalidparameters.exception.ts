
export class InvalidParametersException extends Error {

  constructor (message?: string, _params?: string[]) {
    super((message || 'invalid parameters') + (_params && _params.length > 0 ? ' - parameters :' + _params.join(', '): ''));
  }
}