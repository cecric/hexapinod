
export class InvalidAccessException extends Error {

  constructor (message?: string) {
    super(message || 'user need granted to access ressource');
  }

}