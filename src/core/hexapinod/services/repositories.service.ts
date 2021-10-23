import fs from 'fs';
import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';
import { Model } from '@dependencies/hexapinod-framework/model/model';
import { GenericException } from '@core/hexapinod/exceptions/generic.exception';
import { Service } from '@dependencies/hexapinod-framework/service-manager/service';


/**
 * Repositories Service to load repositories from infrastructure (used for native repositories, not for orm ones)
 * @date 20/09/2021 - 20:00:00
 * @author cecric
 *
 * @export
 * @class RepositoriesService
 * @typedef {RepositoriesService}
 * @extends {Service}
 */
export class RepositoriesService extends Service {

  /**
   * List of available repositories
   * @date 20/09/2021 - 20:00:00
   * @author cecric
   *
   * @protected
   * @type {Record<string,IRepository>}
   */
  protected repositories: Record<string,IRepository> = {};

  /**
   * get the repository for a model
   * @date 20/09/2021 - 20:00:00
   * @author cecric
   *
   * @param {Model} _model
   * @returns {Promise<IRepository>}
   */
  getRepository (_model:Model): Promise<IRepository> {
    const className = _model.constructor.name;
    return this.getRepositoryByName(className);
  }

  /**
   * get the repository by name of the file
   * @date 20/09/2021 - 20:00:00
   * @author cecric
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
    const paramRepo = await import(__dirname + '/../../../infrastructure/repositories/' + (process.env.SERVICE_REPOSITORY_FOLDERS ? process.env.SERVICE_REPOSITORY_FOLDERS + '/': '') + reponame);
    const keyRepositories = Object.keys(paramRepo);
    const keyRepository = keyRepositories.length > 0 ? keyRepositories[0] : 'default';
    const repository = paramRepo[keyRepository];

    this.repositories[_className] = new repository();
    return this.repositories[_className];
  }


}