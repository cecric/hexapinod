
//import app from './src/application/graphQL/server';
import * as dotenv from 'dotenv';
import { Command } from 'commander';
import { logger } from '@dependencies/logger/logger';
import { BaseCommand } from './src/application/cli/basecommand';
import { SubProcessUsecases } from '@core/hexapinod/usecases/subprocess.usecases';
import { ApplicationServer } from '@application/api/server';
dotenv.config({ path: process.env.PWD + '/.env' });


const cliinstance = new Command();

// logger.log(process.env.PWD + '/.env');
// logger.log(process.env);
// // cliinstance.option('-h, --help', 'output help');
cliinstance.option('-d, --debug', 'output extra debugging');

cliinstance.command('server').description('launch the global server')
  .option('--rest', 'launch the REST server')
  .option('--graphql', 'launch the GraphQL server').action(() => {
    try {
      const server = new ApplicationServer();
      server.launch();
    } catch(_error) {
      logger.error('cannot load application server (api) module', _error);
    }
  });

cliinstance.command('subprocess').description('launch a subprocess to perform an action in parallel (should not be called outside)')
  .action(() => {
    SubProcessUsecases.start();
  });


BaseCommand.importCommands (cliinstance).then(() => {
  cliinstance.parse(process.argv);
}).catch ((e) => {
  logger.error('cannot load CLI commands', e);
});