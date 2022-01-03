import { Command } from 'commander';
import fs from 'fs';

/**
 * Description placeholder
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @abstract
 * @class BaseCommand
 * @typedef {BaseCommand}
 */
export abstract class BaseCommand {

  /**
   * Name of command, used to call it
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {*}
   */
  protected instance = null;

  /**
   * Description placeholder
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {*}
   */
  protected name = null;

  /**
   * Alias of command line
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {{}}
   */
  protected alias = [];

  /**
   * Description of the command for the help
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {*}
   */
  protected description = null;

  /**
   * Execute the function with the corresponding parameters
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @abstract
   * @param {...any[]} args
   */
  protected abstract execute(...args: any[]): void;

  /**
   * initialize the command parameters (using commander)
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @abstract
   * @param {Command} _instance
   * @returns {Command}
   */
  public abstract initCommandParameters(_instance: Command): Command;

  /**
   * Initialize command instance (using commander)
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @param {Command} _instance
   * @returns {Command}
   */
  public init(_instance: Command): Command {
    this.initCommandParameters(_instance.command(this.name).description(this.description)).action(this.execute);
    return _instance;
  }

  /**
   * Import commands from the folder
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @static
   * @async
   * @param {Command} _cliinstance
   * @returns {Promise<void>}
   */
  public static async importCommands (_cliinstance: Command): Promise<void> {
    const list = fs.readdirSync('./src/application/cli');
    for (let i = 0; i < list.length; i++) {
      if (list[i].indexOf('.ts') === -1 || list[i].indexOf('.command.ts') === -1) {
        continue;
      }
      const localcommand = await import(new URL('.', import.meta.url).pathname + '/' + list[i]);
      const keycommands = Object.keys(localcommand);
      const keycommand = keycommands.length > 0 ? keycommands[0] : 'default';
      const instcommand:BaseCommand = new localcommand[keycommand]();
      instcommand.init(_cliinstance);
    }
  }

}