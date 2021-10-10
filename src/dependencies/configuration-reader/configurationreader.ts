import fs from 'fs';
import terminal from '@dependencies/terminal/terminal';


class ConfigurationReader {

  protected static instance: ConfigurationReader;

  protected configurationDirectory: string;

  /**
   * Gets instance
   * @returns instance
   */
  public static getInstance (): ConfigurationReader {
    if (!ConfigurationReader.instance) {
      ConfigurationReader.instance = new ConfigurationReader(__dirname + '/../../../config/');
    }
    return ConfigurationReader.instance;
  }

  protected constructor(_configurationDirectory: string) {
    // const confpath = __dirname + '/../../config/lib/mysql-manager.json';
    this.configurationDirectory = _configurationDirectory;
  }

  public getConfiguration (_path: string): Record<string, unknown> | [Record<string, unknown>] {
    return this.readConfigurationFilepath( this.configurationDirectory + _path + '.json');
  }

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