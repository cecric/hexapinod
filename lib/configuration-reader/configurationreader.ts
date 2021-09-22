import fs from 'fs';
import terminal from '../terminal/terminal';


export class ConfigurationReader {



  public readConfigurationFilepath (_configurationPath: string): Record<string, unknown> {
    let configuration = {};
    try {
      if (!fs.existsSync(_configurationPath)) {
        terminal.warn('databases configuration not exists');
      } else {
        const rawdbconfs = fs.readFileSync(_configurationPath);
        configuration = JSON.parse(rawdbconfs.toString());
      }
    } catch (e) {
      terminal.error('cannot load configuration with path : ', _configurationPath);
      configuration = {};
    }
    return this.replaceByEnvironmentVars(configuration);
  }

  public replaceByEnvironmentVars (_configuration: Record<string, unknown>): Record<string, unknown> {
    for (const dbkey in _configuration) {
      if (typeof _configuration[dbkey] === 'string') {
        const valueConfiguration: string = _configuration[dbkey] as string;
        // eslint-disable-next-line prefer-named-capture-group
        _configuration[dbkey] = valueConfiguration.replace(/\{\{process\.env\.([A-Za-z0-9_]+)\}\}/g, function (_repl, _envkey) {
          return process.env[_envkey];
        });
      } else if (typeof _configuration[dbkey] === 'object') {
        _configuration[dbkey] = this.replaceByEnvironmentVars (_configuration[dbkey] as Record<string, unknown>);
      }
    }
    return _configuration;
  }

}