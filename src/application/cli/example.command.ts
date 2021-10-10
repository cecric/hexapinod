import terminal from '@dependencies/terminal/terminal';
import { Command } from 'commander';
import { BaseCommand } from './basecommand';


export default class ExampleCommand extends BaseCommand {


  constructor() {
    super();
    this.name = 'examplecommand';
    this.description = 'example command to test the cli.';
  }

  protected execute(...args: any[]): void {
    const options = args[0];
    terminal.success('the examplecommand is a success with params ', options); // , options.debug
  }

  public initCommandParameters(_instance: Command): Command {
    return _instance.option('--test', 'argument test');
  }

}