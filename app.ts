
//import app from './src/application/graphQL/server';
import * as dotenv from 'dotenv';
import { Command } from 'commander';
import terminal from '@dependencies/terminal/terminal';
import { BaseCommand } from './src/application/cli/basecommand';
import { SubProcessUsecases } from '@core/hexapinod/usecases/subprocess.usecases';
import { ApplicationServer } from '@application/api/server';
dotenv.config({ path: process.env.PWD + '/.env' });


const cliinstance = new Command();

// terminal.log(process.env.PWD + '/.env');
// terminal.log(process.env);
// // cliinstance.option('-h, --help', 'output help');
cliinstance.option('-d, --debug', 'output extra debugging');

cliinstance.command('server').description('launch the global server')
  .option('--rest', 'launch the REST server')
  .option('--graphql', 'launch the GraphQL server').action(() => {
    try {
      const server = new ApplicationServer();
      server.launch();
    } catch(_error) {
      terminal.error('cannot load application server (api) module', _error);
    }
  });

cliinstance.command('subprocess').description('launch a subprocess to perform an action in parallel (should not be called outside)')
  .action(() => {
    SubProcessUsecases.start();
  });


BaseCommand.importCommands (cliinstance).then(() => {
  cliinstance.parse(process.argv);
}).catch ((e) => {
  terminal.error('cannot load CLI commands', e);
});