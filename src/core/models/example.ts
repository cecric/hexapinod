import Model from './model';

export class Example extends Model {
  protected example: string;
  protected dateExample: Date;

  @Model.STRING()
  public setExample (_example: string): Model {
    this.example = _example;
    return this;
  }

  public getExample (): string {
    return this.example;
  }

  @Model.DATE()
  public setDateExample (_dateExample: Date): Model {
    this.dateExample = _dateExample;
    return this;
  }

  public getDateExample (): Date {
    return this.dateExample;
  }
}