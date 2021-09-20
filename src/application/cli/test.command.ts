import terminal from '@lib/terminal/terminal';
import { Command } from 'commander';
import { BaseCommand } from './basecommand';


export default class TestCommand extends BaseCommand {


  protected execute(...args: any[]): void {
    const options = args[0];
    terminal.success('the testcommand is a success with params ', options.debug);
  }

  public initCommandParameters(_instance: Command): Command {
    this.name = 'testcommand';
    this.description = 'command to test the cli.';
    return _instance.option('--test', 'argument test');
  }

}