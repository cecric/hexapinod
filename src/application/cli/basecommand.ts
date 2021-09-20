import { Command } from 'commander';
import fs from 'fs';


export abstract class BaseCommand {

  protected instance = null;

  protected name = null;

  protected alias = [];

  protected description = null;

  protected abstract execute(...args: any[]): void;

  public abstract initCommandParameters(_instance: Command): Command;

  public init(_instance: Command): Command {
    this.name = 'testcommand';
    this.description = 'command to test the cli.';
    this.initCommandParameters(_instance.command (this.name).description(this.description)).action(this.execute);
    return _instance;
  }

  public static async importCommands (_cliinstance: Command): Promise<void> {
    const list = fs.readdirSync('./src/application/cli');
    for (let i = 0; i < list.length; i++) {
      if (list[i].indexOf('.ts') === -1 || list[i].indexOf('.command.ts') === -1) {
        continue;
      }
      const localcommand = await import(__dirname + '/' + list[i]);
      const instcommand:BaseCommand = new localcommand.default();
      instcommand.init(_cliinstance);
    }
  }

}