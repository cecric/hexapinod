import { IRepository } from '@core/hexapinod/interfaces/repositories/repository.interface';
import configurationreader from '@dependencies/configuration-reader/configurationreader';
import { OrmWrapper } from '@dependencies/hexapinod-framework/model/ormwrapper';
import { Connection, createConnections, ObjectType } from 'typeorm';


export class TypeOrmWrapper extends OrmWrapper {

  public static ORM_SUFFIXE = 'typeorm';

  protected connections: Array<Connection>;

  async initialization (): Promise<void> {
    const dbconfs: any = configurationreader.getConfiguration('dependencies/typeorm');
    this.connections = await createConnections(dbconfs);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public getRepository (_entityModel: Function & IRepository, _connectionName?:string): IRepository {
    return (_connectionName ? this.connections.find(val => val['name'] === _connectionName) : this.connections[0]).getCustomRepository(_entityModel as ObjectType<IRepository>) as IRepository;
  }

}