import mysql from 'mysql';
import util from 'util';
import { logger } from '@dependencies/logger/logger';
import { ConfigurationReader } from '@dependencies/configuration-reader/configurationreader';

/**
 * Pools of connection to perform queries.
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @type {{}}
 */
const connectionPools = {};

/**
 * Loaded configuration for databases.
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @type {Record<string, unknown>}
 */
const dbconfs: Record<string, unknown> = ConfigurationReader.getConfiguration('dependencies/mysql-manager') as Record<string, unknown>;

/**
 * Initialize pools of connections from the loaded configuration.
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @param {*} _conf
 * @returns {unknown}
 */
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
    logger.info('New Mysql connection ' + connection.config.database + ':' + connection.threadId);
    // TODO set it in settings
    // try {
    //   // max time for query to avoid locks
    //   // connection.query('SET SESSION max_statement_time=600');
    // } catch (err) {
    //   logger.error(err);
    // }
  });
  pool.on('enqueue', function () {
    logger.warn('Waiting for an available connection slot');
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pool.on('release', function (connection) {
    //term.log('Connection ' + connection.threadId + ' released');
  });
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error('Database error (' + err.code + ')', err);
        let confError = '';
        if(_conf['host'] && _conf['user'] && _conf['database']){
          confError = _conf['user'] + '@' + _conf['host'] + ':' + _conf['database'];
          logger.error('Configuration used during error : ' + confError);
        }
        // Plantage du process principal si  on throw l erreur. Donc on commente
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          logger.error('Database connection was closed.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
          logger.error('Database has too many connections.');
        } else if (err.code === 'ECONNREFUSED') {
          logger.error('Database connection was refused.');
        } else {
          logger.error('Database common error code : ', err.code);
        }
      }
      if (connection) {
        connection.release();
      }
    });
    return pool;
  } catch (err) {
    logger.error(err);
    return null;
  }
}

/**
 * get the current connection pool
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @param {string} [_instance='main']
 * @returns {*}
 */
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

/**
 * get the current connection pool with the promised version.
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @param {string} [_instance='main']
 * @returns {Promise<unknown>}
 */
const getAsyncConnectionPool = function(_instance = 'main'): Promise<unknown> {
  return getConnectionPool(_instance).promised;
};


/**
 * Wrapper of the escape function
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @type {*}
 */
const escape = mysql.escape;



/**
 * Class DBManager wich help to connect and perform request on mariadb/mysql servers.
 * Must be inherited by the repositories classes
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @abstract
 * @class DBManager
 * @typedef {DBManager}
 */
export abstract class DBManager {


  /**
   * Return a pool of connexions for mariadb/mysql
   * Pool are established connexions.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {?string} [_instance]
   * @returns {unknown}
   */
  public getPool (_instance?: string): unknown {
    return getConnectionPool(_instance);
  }

  /**
   * Return the promise of a pool of connexions for mariadb/mysql.
   * Pool are established connexions.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {?string} [_instance]
   * @returns {unknown}
   */
  public getAsyncPool (_instance?: string): Promise<unknown> {
    return getAsyncConnectionPool(_instance);
  }

  /**
   * Make a query with callback on mariadb/mysql server
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {string} _query
   * @param {Function} _callback
   * @param {?string} [_instance]
   * @returns {unknown}
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public query(_query: string, _callback: Function, _instance?: string): unknown {
    return this.getPool(_instance)['query'](_query, _callback);
  }

  /**
   * Make an asynchronous query (it return a promise).
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {string} _query
   * @param {?string} [_instance]
   * @returns {Promise<unknown>}
   */
  public asyncQuery(_query: string, _instance?: string): Promise<unknown> {
    return this.getAsyncPool(_instance)['query'](_query);
  }

  /**
   * Function to escape parameters to prevent SQL injections
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {unknown} _params
   * @returns {string}
   */
  public escape (_params: unknown): string {
    return escape (_params);
  }

}

