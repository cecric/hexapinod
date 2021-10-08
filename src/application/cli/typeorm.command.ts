import { Command } from 'commander';
import { BaseCommand } from './basecommand';
import { execSync } from 'child_process';
import terminal from '@dependencies/terminal/terminal';

export default class TypeORMCommand extends BaseCommand {

  constructor() {
    super();
    this.name = 'typeorm';
    this.description = 'TypeORM from hexapinod.';
  }

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

    const options = args[0];
    terminal.log(args, options);
    const command = 'node ' + __dirname + '/../../../node_modules/typeorm/cli.js ';
    try {
      terminal.log(command);
      // execSync(command);
    } catch(e) {
      terminal.error(e.message);
    }
  }

  public initCommandParameters(_instance: Command): Command {
    return _instance.argument('<typeorm argument>', 'allowed values migration:generate') .option('-v', 'verbode');
  }

}