
export class NotFoundException extends Error {

  constructor (message?: string) {
    super(message || 'resource not found');
  }
}