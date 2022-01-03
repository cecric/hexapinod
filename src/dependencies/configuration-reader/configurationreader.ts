import fs from 'fs';
import { logger } from '@dependencies/logger/logger';


/**
 * Configuration reader, used to read configuration files from the configuration (config) folder
 * and replace environment variable.
 * @date 22/09/2021 - 08:00:00
 * @author cecric
 *
 * @class ConfigurationReader
 * @typedef {ConfigurationReaderTool}
 */
class ConfigurationReaderTool {

  /**
   * Instance of singleton
   * @date 22/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @static
   * @type {ConfigurationReader}
   */
  protected static instance: ConfigurationReaderTool;

  /**
   * the configuration base directory
   * @date 22/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {string}
   */
  protected configurationDirectory: string;

  /**
   * Get instance of singleton
   * @date 22/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @returns {ConfigurationReader}
   */
  public static getInstance (): ConfigurationReaderTool {
    if (!ConfigurationReaderTool.instance) {
      ConfigurationReaderTool.instance = new ConfigurationReaderTool(new URL('.', import.meta.url).pathname + '/../../../config/');
    }
    return ConfigurationReaderTool.instance;
  }

  /**
   * Creates an instance of ConfigurationReader.
   * @date 22/09/2021 - 08:00:00
   * @author cecric
   *
   * @constructor
   * @protected
   * @param {string} _configurationDirectory
   */
  protected constructor(_configurationDirectory: string) {
    // const confpath = new URL('.', import.meta.url).pathname + '/../../config/lib/mysql-manager.json';
    this.configurationDirectory = _configurationDirectory;
  }

  /**
   * return the configuration object by the relative path of conf
   * @date 22/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {string} _path
   * @returns {(Record<string, unknown> | [Record<string, unknown>])}
   */
  public getConfiguration (_path: string): Record<string, unknown> | [Record<string, unknown>] {
    return this.readConfigurationFilepath( this.configurationDirectory + _path + '.json');
  }

  /**
   * Read the configuration file and return the configuration object
   * @date 22/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {string} _configurationPath the relative path to config
   * @returns {Record<string, unknown>} the configuration object
   */
  protected readConfigurationFilepath (_configurationPath: string): Record<string, unknown> {
    logger.info('load configuration file ' + _configurationPath);
    let configuration = {};
    try {
      if (!fs.existsSync(_configurationPath)) {
        logger.warn('configuration ' + _configurationPath + ' not exists');
      } else {
        const rawConf = fs.readFileSync(_configurationPath);
        configuration = JSON.parse(rawConf.toString());
      }
    } catch (e) {
      logger.error('cannot load configuration with path : '+ _configurationPath);
      configuration = {};
    }
    return this.replaceByEnvironmentVars(configuration);
  }

  /**
   * Replace env vars by their values
   * @date 22/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {Record<string, unknown>} _configuration
   * @returns {Record<string, unknown>} the configuration object updated with values
   */
  protected replaceByEnvironmentVars (_configuration: Record<string, unknown>): Record<string, unknown> {
    for (const dbkey in _configuration) {
      if (typeof _configuration[dbkey] === 'string') {
        const valueConfiguration: string = _configuration[dbkey] as string;
        // eslint-disable-next-line prefer-named-capture-group
        _configuration[dbkey] = valueConfiguration.replace(/\{\{process\.env\.([A-Za-z0-9_]+)\}\}/g, function (_repl, _envkey) {
          return process.env[_envkey];
        });
        if (typeof _configuration[dbkey] === 'string' && (_configuration[dbkey] === 'true' || _configuration[dbkey] === 'false')) {
          _configuration[dbkey] = _configuration[dbkey] === 'true';
        }
      } else if (typeof _configuration[dbkey] === 'object') {
        _configuration[dbkey] = this.replaceByEnvironmentVars (_configuration[dbkey] as Record<string, unknown>);
      }
    }
    return _configuration;
  }

}

export type { ConfigurationReaderTool };


/**
 * Instance exported of ConfigurationReader
 * @date 20/10/2021 - 22:33:54
 * @author cecric
 *
 * @type {ConfigurationReaderTool}
 */
export const ConfigurationReader = ConfigurationReaderTool.getInstance();