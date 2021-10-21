import { Example } from '@core/example/models/example';
import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';

/**
 * Example interface of repository implemented in infrastructure part
 * @date 27/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @interface IExample
 * @typedef {IExample}
 * @extends {IRepository}
 */
export interface IExample extends IRepository {

    /**
     * perform an example request
     * @date 27/09/2021 - 08:00:00
     * @author cecric
     *
     * @returns {Promise<Example>}
     */
    getExample(): Promise<Example> ;
}