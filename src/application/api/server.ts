import express from 'express';
import errorMiddleware from './rest/middlewares/error.middleware';
import middlewares from './rest/middlewares';
import { initializeRoutes } from './rest/routes';
import terminal from '@dependencies/terminal/terminal';
import cluster from 'cluster';
import fs from 'fs';
import https from 'https';
import http from 'http';
import os from 'os';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import expressWinston from 'express-winston';
import ConfigurationReader from '@dependencies/configuration-reader/configurationreader';

class App {
  public app: express.Application;
  protected configuration: Record<string, unknown>;

  constructor() {
    this.app = express();
    this.configuration = ConfigurationReader.getConfiguration('application/api/server') as Record<string, unknown>;
  }

  private async config(): Promise<void> {
    this.app.use(express.json({limit: '2mb'}));
    this.app.use(express.urlencoded({ extended: false }));


    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 2000, // limit 2000 requests / 15min / ip (40 threads in production -store memmory used- => 320000/h/ip ==> 5333 /min/ip )
      message: 'Too many requests from this IP, please wait a moment.',
      onLimitReached: function (req) { // , res, options
        terminal.warn(req.ip + ' rateLimit reached');
      }
    });
    this.app.use(limiter);
    this.app.use(helmet());
    this.app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function () { // req, res
        return false;
      } // optional: allows to skip some log messages based on request and/or response
    }));
    terminal.info ('init: ping');
    this.app.all( '/ping', function(req, res) {
      res.status(200).send({'status': 'pong'});
    });
    terminal.info ('init: middleware');
    this.app.use(middlewares);

    // Routes
    terminal.info ('init: routes');
    const routerRoutes = express.Router();
    this.app.use(await initializeRoutes(routerRoutes));

    // Middleware de gestion des erreurs (mis en dernier pour gérer les 404)
    terminal.info ('init: error management middleware');
    this.app.all( '*', function(req, res) {
      res.status(404).send({'error': 'ressource not found'});
    });
    this.app.use(errorMiddleware);
  }

  public async launch(): Promise<void> {
    if (this.configuration['clustering']) {
      if ((typeof cluster.isPrimary !== 'undefined' && cluster.isPrimary) || (typeof cluster.isMaster !== 'undefined' && cluster.isMaster)) {
        terminal.log(`Master ${process.pid} is running`);
        const nbSubProcess = Math.max(1, Math.round(os.cpus().length / 2));
        for (let i = 0; i < nbSubProcess; i++) {
          cluster.fork();
        }
        cluster.on('exit', (worker, _code, _signal) => {
          terminal.warn(`worker ${worker.process.pid} died`, _code, _signal);
        });
      } else {
        await this.config();
        this.launchServer();
      }
    } else {
      await this.config();
      this.launchServer();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onSocketServer(_socket: any): void {
    terminal.info('socket.io: socket connected');
  }

  protected launchServer(): void {
    if (this.configuration['https'] && this.configuration['https']['activated']) {
      const privateKey = fs.readFileSync(this.configuration['https']['private_key_filepath'], 'utf8');
      const certificate = fs.readFileSync(this.configuration['https']['public_cert_filepath'], 'utf8');
      const credentials = {key: privateKey, cert: certificate};
      const httpsServer = https.createServer(credentials, this.app);
      const ioServer = new Server(httpsServer);
      ioServer.on('connection', this.onSocketServer );
      const port = this.configuration['port'] || 3443;
      httpsServer.listen(this.configuration['host'] ? {'port': port, 'host': this.configuration['host']} : port);
      terminal.success(`API worker ${process.pid} listening on port ${port} (HTTPS)`);
    } else {
      const port = this.configuration['port'] || 3000;
      // this.app.listen(port, () => terminal.success(`TRF api worker ${process.pid} listening on port ${port} (HTTP)`));
      const httpServer = http.createServer(this.app);
      const ioServer = new Server(httpServer);
      ioServer.on('connection', this.onSocketServer );
      httpServer.listen(this.configuration['host'] ? {'port': port, 'host': this.configuration['host']} : port);
      terminal.success(`API worker ${process.pid} listening on port ${port} (HTTP)`);
    }
  }
}


export default new App();