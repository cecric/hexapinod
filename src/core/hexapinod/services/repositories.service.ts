import fs from 'fs';
import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';
import { Model } from '@dependencies/hexapinod-framework/model/model';
import { GenericException } from '@core/hexapinod/exceptions/generic.exception';
import { Service } from '@dependencies/hexapinod-framework/service-manager/service';


/**
 * Repositories Service to load repositories from infrastructure (used for native repositories, not for orm ones)
 * @date 20/09/2021 - 20:00:00
 *
 * @export
 * @class RepositoriesService
 * @typedef {RepositoriesService}
 * @extends {Service}
 */
export class RepositoriesService extends Service {

  /**
   * Description placeholder
   * @date 20/09/2021 - 20:00:00
   *
   * @protected
   * @type {Record<string,IRepository>}
   */
  protected repositories: Record<string,IRepository> = {};

  /**
   * Description placeholder
   * @date 20/09/2021 - 20:00:00
   *
   * @param {Model} _model
   * @returns {Promise<IRepository>}
   */
  getRepository (_model:Model): Promise<IRepository> {
    const className = _model.constructor.name;
    return this.getRepositoryByName(className);
  }

  /**
   * Description placeholder
   * @date 20/09/2021 - 20:00:00
   *
   * @async
   * @param {string} _className
   * @returns {Promise<IRepository>}
   */
  async getRepositoryByName (_className:string): Promise<IRepository> {
    if (!Array.isArray(this.repositories)) {
      this.repositories = {};
    }
    if (this.repositories[_className]) {
      return this.repositories[_className];
    }
    const reponame = _className.toLowerCase() + '.repo';
    if (!fs.existsSync(__dirname + '/../../../infrastructure/repositories/' + (process.env.SERVICE_REPOSITORY_FOLDERS ? process.env.SERVICE_REPOSITORY_FOLDERS + '/' : '') + reponame + '.ts')) {
      throw new GenericException('repository not found: ' + reponame + ' (' + _className + ') in directory ' + __dirname + '/../../../infrastructure/repositories/' + (process.env.SERVICE_REPOSITORY_FOLDERS ? process.env.SERVICE_REPOSITORY_FOLDERS + '/': ''));
    }
    const paramrepo = await import(__dirname + '/../../../infrastructure/repositories/' + (process.env.SERVICE_REPOSITORY_FOLDERS ? process.env.SERVICE_REPOSITORY_FOLDERS + '/': '') + reponame);
    const repository = paramrepo.default;

    this.repositories[_className] = new repository();
    return this.repositories[_className];
  }


}