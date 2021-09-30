import fs from 'fs';
import IRepository from '@core/hexapinod/interfaces/repositories/repository.interface';
import Model from '@dependencies/hexapinod-framework/orm/model';
import { GenericException } from '@core/hexapinod/exceptions/generic.exception';
import { Service } from '@dependencies/hexapinod-framework/service-manager/service';


export class RepositoriesService extends Service {

  protected repositories: Record<string,IRepository> = {};

  getRepository (_model:Model): Promise<IRepository> {
    const className = _model.constructor.name;
    return this.getRepositoryByName(className);
  }

  async getRepositoryByName (_className:string): Promise<IRepository> {
    if (!Array.isArray(this.repositories)) {
      this.repositories = {};
    }
    if (this.repositories[_className]) {
      return this.repositories[_className];
    }
    const reponame = _className.toLowerCase() + '.repo';
    if (!fs.existsSync(__dirname + '/../../../infrastructure/repositories/' + process.env.SERVICE_REPOSITORY_FOLDERS + '/' + reponame + '.ts')) {
      throw new GenericException('repository not found: ' + reponame + ' (' + _className + ') in directory ' + __dirname + '/../../../infrastructure/repositories/' + process.env.SERVICE_REPOSITORY_FOLDERS + '/');
    }
    const paramrepo = await import(__dirname + '/../../../infrastructure/repositories/' + process.env.SERVICE_REPOSITORY_FOLDERS + '/' + reponame);
    const repository = paramrepo.default;
    this.repositories[_className] = new repository();
    return this.repositories[_className];
  }

}