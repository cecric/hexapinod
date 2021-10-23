import { Model } from '@dependencies/hexapinod-framework/model/model';
import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Example of model entity class using typeORM
 * @date 04/10/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ExampleOrm
 * @typedef {ExampleOrm}
 * @extends {Model}
 */
@Entity()
export class ExampleOrm extends Model {

    /**
     * id numeric used as primary column
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @protected
     * @type {number}
     */
    @PrimaryColumn()
    protected id: number;

    /**
     * example string (used as column)
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @protected
     * @type {string}
     */
    @Column()
    protected example: string;

    /**
     * example date (used as column)
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @protected
     * @type {Date}
     */
    @Column()
    protected dateExample: Date;

    /**
     * set the example string
     * @date 04/10/2021 - 08:00:00
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
     * @date 04/10/2021 - 08:00:00
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
     * @date 04/10/2021 - 08:00:00
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
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @public
     * @returns {Date}
     */
    public getDateExample (): Date {
      return this.dateExample;
    }

}