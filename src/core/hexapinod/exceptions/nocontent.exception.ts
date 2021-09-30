
export class NoContentException extends Error {

  constructor (message?: string) {
    super(message || 'no resource');
  }
}