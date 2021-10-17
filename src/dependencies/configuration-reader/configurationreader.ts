import fs from 'fs';
import terminal from '@dependencies/terminal/terminal';


/**
 * Configuration reader, used to read configuration files from the configuration (config) folder
 * and replace environment variable.
 * @date 22/09/2021 - 08:00:00
 *
 * @class ConfigurationReader
 * @typedef {ConfigurationReader}
 */
class ConfigurationReader {

  /**
   * Instance of singleton
   * @date 22/09/2021 - 08:00:00
   *
   * @protected
   * @static
   * @type {ConfigurationReader}
   */
  protected static instance: ConfigurationReader;

  /**
   * the configuration base directory
   * @date 22/09/2021 - 08:00:00
   *
   * @protected
   * @type {string}
   */
  protected configurationDirectory: string;

  /**
   * Get instance of singleton
   * @date 22/09/2021 - 08:00:00
   *
   * @public
   * @static
   * @returns {ConfigurationReader}
   */
  public static getInstance (): ConfigurationReader {
    if (!ConfigurationReader.instance) {
      ConfigurationReader.instance = new ConfigurationReader(__dirname + '/../../../config/');
    }
    return ConfigurationReader.instance;
  }

  /**
   * Creates an instance of ConfigurationReader.
   * @date 22/09/2021 - 08:00:00
   *
   * @constructor
   * @protected
   * @param {string} _configurationDirectory
   */
  protected constructor(_configurationDirectory: string) {
    // const confpath = __dirname + '/../../config/lib/mysql-manager.json';
    this.configurationDirectory = _configurationDirectory;
  }

  /**
   * return the configuration object by the relative path of conf
   * @date 22/09/2021 - 08:00:00
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
   *
   * @protected
   * @param {string} _configurationPath the relative path to config
   * @returns {Record<string, unknown>} the configuration object
   */
  protected readConfigurationFilepath (_configurationPath: string): Record<string, unknown> {
    terminal.info('load configuration file ' + _configurationPath);
    let configuration = {};
    try {
      if (!fs.existsSync(_configurationPath)) {
        terminal.warn('configuration ' + _configurationPath + ' not exists');
      } else {
        const rawConf = fs.readFileSync(_configurationPath);
        configuration = JSON.parse(rawConf.toString());
      }
    } catch (e) {
      terminal.error('cannot load configuration with path : '+ _configurationPath);
      configuration = {};
    }
    return this.replaceByEnvironmentVars(configuration);
  }

  /**
   * Replace env vars by their values
   * @date 22/09/2021 - 08:00:00
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

export default ConfigurationReader.getInstance();