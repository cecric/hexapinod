import { logger } from '@dependencies/logger/logger';
import { Command } from 'commander';
import { BaseCommand } from './basecommand';

/**
 * Example command to show how you should implement it.
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ExampleCommand
 * @typedef {ExampleCommand}
 * @extends {BaseCommand}
 */
export class ExampleCommand extends BaseCommand {

  /**
   * Creates an instance of ExampleCommand.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @constructor
   */
  constructor() {
    super();
    this.name = 'examplecommand';
    this.description = 'example command to test the cli.';
  }

  /**
   * @inheritdoc
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @param {...any[]} args
   */
  protected execute(...args: any[]): void {
    const options = args[0];
    logger.success('the examplecommand is a success with params ', options); // , options.debug
  }

  /**
   * @inheritdoc
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {Command} _instance
   * @returns {Command}
   */
  public initCommandParameters(_instance: Command): Command {
    return _instance.option('--test', 'argument test');
  }

}