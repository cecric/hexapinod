import mysql from 'mysql';
import util from 'util';
import terminal from '@dependencies/terminal/terminal';
import ConfigurationReader from '@dependencies/configuration-reader/configurationreader';

const connectionPools = {};
// const databases = process.env.ENVIRONNEMENT_DATABASES === 'LOCAL' ? 'databases.locale' : process.env.ENVIRONNEMENT_DATABASES === 'REMOTE' ? 'databases.remote' : 'databases';
const dbconfs: Record<string, unknown> = ConfigurationReader.getConfiguration('dependencies/mysql-manager') as Record<string, unknown>;


function initializePoolsFromConfiguration (_conf): unknown {
  const pool = mysql.createPool(Object.assign({
    connectionLimit: 3,
    multipleStatements: true,
    dateStrings: [
      'DATE',
      'DATETIME'
    ]
  }, _conf));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pool.on('acquire', function (connection) {
    //term.log('Connection ' + connection.threadId + ' acquired');
  });
  pool.on('connection', function (connection) {
    terminal.info('New Mysql connection ' + connection.config.database + ':' + connection.threadId);
    try {
      // max time for query pour eviter blocage moteur et blocage user
      // idelalement 120sec max par query, max time before socket hang up apache
      // export peut faire de longues requetes, on met globalement pour l instant 10 min max / req
      connection.query('SET SESSION max_statement_time=600');
    } catch (err) {
      terminal.error(err);
    }

    //term.log('new connect mysql : SET SESSION max_statement_time=1');
  });
  pool.on('enqueue', function () {
    terminal.warn('Waiting for available connection slot');
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pool.on('release', function (connection) {
    //term.log('Connection ' + connection.threadId + ' released');
  });
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        terminal.error('Database error (' + err.code + ')', err);
        let confError = '';
        if(_conf['host'] && _conf['user'] && _conf['database']){
          confError = _conf['user'] + '@' + _conf['host'] + ':' + _conf['database'];
          terminal.error('Configuration used during error : ' + confError);
        }
        // Plantage du process principal si  on throw l erreur. Donc on commente
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          terminal.error('Database connection was closed.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
          terminal.error('Database has too many connections.');
        } else if (err.code === 'ECONNREFUSED') {
          terminal.error('Database connection was refused.');
        } else {
          terminal.error('Database common error code : ', err.code);
        }
      }
      if (connection) {
        connection.release();
      }
    });
    return pool;
  } catch (err) {
    terminal.error(err);
    return null;
    //throw Error('Database connection was refused.');
  }
}


const getConnectionPool = function(_instance = 'main'): any {
  if(!dbconfs || !dbconfs[_instance]) {
    throw Error('No db configurations defined for configuration : ' + _instance + '.');
  }
  if(dbconfs[_instance] && !connectionPools[dbconfs[_instance]['database']]) {
    connectionPools[dbconfs[_instance]['database']] = initializePoolsFromConfiguration( dbconfs[_instance]);
    const promquery = util.promisify(connectionPools[dbconfs[_instance]['database']].query).bind(connectionPools[dbconfs[_instance]['database']]);
    connectionPools[dbconfs[_instance]['database']].promised =
      {
        'query': promquery
      };
  }
  return connectionPools[dbconfs[_instance]['database']];
};

const getAsyncConnectionPool = function(_instance = 'main'): Promise<unknown> {
  return getConnectionPool(_instance).promised;
};

const escape = mysql.escape;



export abstract class DBManager {

  public getPool (_instance?: string): unknown {
    return getConnectionPool(_instance);
  }

  public getAsyncPool (_instance?: string): unknown {
    return getAsyncConnectionPool(_instance);
  }

  public query(_query: string, _instance?: string): unknown {
    return this.getPool(_instance)['query'](_query);
  }

  public asyncQuery(_query: string, _instance?: string): Promise<unknown> {
    return this.getAsyncPool(_instance)['query'](_query);
  }

  public escape (_params: unknown): string {
    return escape (_params);
  }

}

// export {getConnectionPool as DBManager, getAsyncConnectionPool as asyncDBManager, escape};
