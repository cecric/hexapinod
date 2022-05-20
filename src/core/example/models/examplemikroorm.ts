import { Model } from '@dependencies/hexapinod-framework/model/model';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
// EntityManager, EntityRepository, RequestContext,

/**
 * Example of model entity class using Mikro Orm
 * @date 20/05/2022 - 14:00:00
 * @author cecric
 *
 * @export
 * @class ExampleOrm
 * @typedef {ExampleOrm}
 * @extends {Model}
 */
 @Entity()
export class ExampleMikroOrm extends Model {

    /**
     * id numeric used as primary column
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @protected
     * @type {number}
     */
    @PrimaryKey()
    protected id: number;

    /**
     * example string (used as column)
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @protected
     * @type {string}
     */
    @Property()
    protected example: string;

    /**
     * example date (used as column)
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @protected
     * @type {Date}
     */
    @Property()
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