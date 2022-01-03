import { Command } from 'commander';
import { BaseCommand } from './basecommand';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { logger } from '@dependencies/logger/logger';
import { ConfigurationReader } from '@dependencies/configuration-reader/configurationreader';
import { execSync } from 'child_process';

/**
 * Command de wrap the CLI of TypeORM into the framework.
 * It is usefull to ingretate it correctly with the path and configuration.
 * @date 08/10/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class TypeORMCommand
 * @typedef {TypeORMCommand}
 * @extends {BaseCommand}
 */
export class TypeORMCommand extends BaseCommand {

  /**
   * Creates an instance of TypeORMCommand.
   * @date 08/10/2021 - 08:00:00
   * @author cecric
   *
   * @constructor
   */
  constructor() {
    super();
    this.name = 'typeorm';
    this.description = 'TypeORM from hexapinod.';
  }

  /**
   * @inheritdoc
   * @date 08/10/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {...any[]} args
   */
  protected execute(...args: any[]): void {
    // Usage: cli.js <command> [options]

    // Commandes :
    //   cli.js schema:sync         Synchronizes your entities with database schema. It
    //                              runs schema update queries on all connections you
    //                              have. To run update queries on a concrete
    //                              connection use -c option.
    //   cli.js schema:log          Shows sql to be executed by schema:sync command. It
    //                              shows sql log only for your default connection. To
    //                              run update queries on a concrete connection use -c
    //                              option.
    //   cli.js schema:drop         Drops all tables in the database on your default
    //                              connection. To drop table of a concrete
    //                              connection's database use -c option.
    //   cli.js query [query]       Executes given SQL query on a default connection.
    //                              Specify connection name to run query on a specific
    //                              connection.
    //   cli.js entity:create       Generates a new entity.
    //   cli.js subscriber:create   Generates a new subscriber.
    //   cli.js migration:create    Creates a new migration file.
    //                                                      [alias : migrations:create]
    //   cli.js migration:generate  Generates a new migration file with sql needs to be
    //                              executed to update schema.
    //                                                    [alias : migrations:generate]
    //   cli.js migration:run       Runs all pending migrations.
    //                                                         [alias : migrations:run]
    //   cli.js migration:show      Show all migrations and whether they have been run
    //                              or not
    //   cli.js migration:revert    Reverts last executed migration.
    //                                                      [alias : migrations:revert]
    //   cli.js version             Prints TypeORM version this project uses.
    //   cli.js cache:clear         Clears all data stored in query runner cache.
    //   cli.js init                Generates initial TypeORM project structure. If
    //                              name specified then creates files inside directory
    //                              called as name. If its not specified then creates
    //                              files inside current directory.

    // Options :
    //   -h, --help     Affiche l'aide                                        [booléen]
    //   -v, --version  Affiche le numéro de version                          [booléen]

    const argument = args[0];
    const options = args[1];
    // -c <your-config-name>
    // -f <>
    // entity:create -n User -d src/user/entity
    // subscriber:create -n UserSubscriber -d src/user/subscriber
    // migration:create -n UserMigration -d src/user/migration
    // migration:generate -n UserMigration -d src/user/migration
    // migration:run
    // migration:revert
    // migration:show
    // schema:sync
    // schema:log
    // schema:drop
    // cache:clear
    // version
    const tmpConfigurationPath = fs.mkdtempSync(path.join(os.tmpdir(), 'hexapinod'));
    const relativeConfigurationPath = path.relative(process.cwd(), tmpConfigurationPath);
    try {
      fs.mkdirSync(tmpConfigurationPath);
      const dbconfs: any = ConfigurationReader.getConfiguration('dependencies/typeorm');
      const data = JSON.stringify(dbconfs);
      fs.writeFileSync(tmpConfigurationPath + '/typeorm.json', data);
      let command = 'node ' + new URL('.', import.meta.url).pathname + '/../../../node_modules/typeorm/cli.js';

      switch (argument) {
      case 'version':
        command += ' version';
        break;
      case 'migration:show':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'migration:create':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        command += ' -n ' + options['name'];
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'migration:generate':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        command += ' -n ' + options['name'];
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'migration:run':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'migration:revert':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'schema:sync':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'schema:log':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'schema:drop':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'cache:clear':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        break;
      case 'entity:create':
        if (!options['bundle']) {
          throw new Error('bundle options is required');
        }
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        command += ' -n ' + options['name'];
        command += ' -d src/core/' + options['bundle'] + '/models';
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      case 'subscriber:create':
        command += ' -f ' + relativeConfigurationPath + '/typeorm.json';
        command += ' ' + argument;
        command += ' -n ' + options['name'];
        if (options['connection']) {
          command += ' -c ' + options['connection'];
        }
        break;
      default:
        throw new Error('invalid option ' + argument + ' for typeorm');
      }
      if (options['verbose']) {
        logger.log(command);
      }
      const bufferReturn: Buffer = execSync(command);
      logger.log(bufferReturn.toString());
    } catch(e) {
      logger.error(e.message);
    } finally {
      try {
        if (tmpConfigurationPath) {
          fs.rmdirSync(tmpConfigurationPath, { recursive: true });
        }
      } catch (e) {
        logger.error(`An error has occurred while removing the temporary folder at ${tmpConfigurationPath}. Error: ${e}`);
      }
    }
  }

  /**
   * @inheritdoc
   * @date 08/10/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {Command} _instance
   * @returns {Command}
   */
  public initCommandParameters(_instance: Command): Command {
    return _instance.argument('<typeorm argument>', 'allowed values migration:generate')
      .option('-v, --verbose', 'verbose mode')
      .option('-b, --bundle <thebundlename>', 'the name of bundle in core')
      .option('-n, --name <thename>', 'the name of entity/subscriber')
      .option('-c, --connection <theconnectionname>', 'the name of connection');
  }

}