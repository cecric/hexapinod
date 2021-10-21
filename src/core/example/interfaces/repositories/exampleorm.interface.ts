import { ExampleOrm } from '@core/example/models/exampleorm';
import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';

/**
 * Example interface of ORM repository implemented in infrastructure part
 * @date 04/10/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @interface IExampleOrm
 * @typedef {IExampleOrm}
 * @extends {IRepository}
 */
export interface IExampleOrm extends IRepository {

    /**
     * perform an example request
     * @date 04/10/2021 - 08:00:00
     * @author cecric
     *
     * @returns {Promise<ExampleOrm>}
     */
    getExample(): Promise<ExampleOrm> ;
}