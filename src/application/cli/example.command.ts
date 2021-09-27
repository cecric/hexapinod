import terminal from '@dependencies/terminal/terminal';
import { Command } from 'commander';
import { BaseCommand } from './basecommand';


export default class ExampleCommand extends BaseCommand {


  protected execute(...args: any[]): void {
    const options = args[0];
    terminal.success('the examplecommand is a success with params ', options.debug);
  }

  public initCommandParameters(_instance: Command): Command {
    this.name = 'examplecommand';
    this.description = 'example command to test the cli.';
    return _instance.option('--test', 'argument test');
  }

}