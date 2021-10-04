import IRepository from '@core/hexapinod/interfaces/repositories/repository.interface';
import configurationreader from '@dependencies/configuration-reader/configurationreader';
import { Connection, createConnections, ObjectType } from 'typeorm';


export class TypeOrmWrapper {

  protected connections: Array<Connection>;

  async init (): Promise<void> {
    const dbconfs: any = configurationreader.getConfiguration('dependencies/typeorm');
    this.connections = await createConnections(dbconfs);
  }

  getRepository (_name:string, _instance: ObjectType<IRepository>): IRepository {
    return (_name ? this.connections.find(val => val['name'] === _name) : this.connections[0]).getCustomRepository(_instance) as IRepository;
  }

}