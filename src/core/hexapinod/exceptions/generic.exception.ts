
export class GenericException extends Error {

  protected details: any;

  constructor (_message?: string, _details?: unknown) {
    super(_message || 'internal error');
    this.details = _details;
  }

  public getDetails (): any {
    return this.details;
  }

}