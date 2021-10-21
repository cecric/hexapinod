import { Model } from '@dependencies/hexapinod-framework/model/model';

/**
 * Example of model entity class using no ORM
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class Example
 * @typedef {Example}
 * @extends {Model}
 */
export class Example extends Model {

  /**
   * Example string
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {string}
   */
  protected example: string;

  /**
   * example date
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {Date}
   */
  protected dateExample: Date;

  /**
   * set the example string
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {string} _example
   * @returns {Model}
   */
  @Model.STRING()
  public setExample (_example: string): Model {
    this.example = _example;
    return this;
  }

  /**
   * get the example string
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @returns {string}
   */
  public getExample (): string {
    return this.example;
  }

  /**
   * set the example date
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {Date} _dateExample
   * @returns {Model}
   */
  @Model.DATE()
  public setDateExample (_dateExample: Date): Model {
    this.dateExample = _dateExample;
    return this;
  }

  /**
   * get the example date
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @returns {Date}
   */
  public getDateExample (): Date {
    return this.dateExample;
  }
}