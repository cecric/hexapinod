
export class AccessDeniedException extends Error {

  constructor (message?: string) {
    super(message || 'access denied to the resource');
  }

}