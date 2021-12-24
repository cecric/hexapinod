import express from 'express';
import { errorMiddleware } from './rest/middlewares/error.middleware';
import middlewares from './rest/middlewares';
import { initializeRoutes } from './rest/routes';
import { logger } from '@dependencies/logger/logger';
import cluster from 'cluster';
import fs from 'fs';
import https from 'https';
import http from 'http';
import os from 'os';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import expressWinston from 'express-winston';
import { ConfigurationReader } from '@dependencies/configuration-reader/configurationreader';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import { SwaggerUiOptions } from 'swagger-ui-express';
import { WebSocketServer } from './wsserver';

/**
 * Application server to launch http(s) server and load dynamically the corresponding routes
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @class ApplicationServer
 * @typedef {ApplicationServer}
 */
export class ApplicationServer {

  /**
   * Express application server
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @type {express.Application}
   */
  public app: express.Application;


  /**
   * Configuration server
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   * @type {Record<string, unknown>}
   */
  protected configuration: Record<string, unknown>;

  /**
   * Description placeholder
   * @date 25/10/2021 - 09:22:17
   * @author cecric
   *
   * @protected
   * @type {Record<string, unknown>}
   */
  protected configurationOpenApi: Record<string, unknown>;

  /**
   * Creates an instance of ApplicationServer.
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @constructor
   */
  constructor() {
    this.app = express();
    this.configuration = ConfigurationReader.getConfiguration('application/api/server') as Record<string, unknown>;
    this.configurationOpenApi = ConfigurationReader.getConfiguration('application/api/openapi') as Record<string, unknown>;
  }




  /**
   * Generate the OpenAPI base configuration for the plugin
   * @date 25/10/2021 - 10:15:20
   * @author cecric
   *
   * @private
   * @returns {{ info: InfoObject; security: Security; baseDir: any; filesPattern: string; swaggerUIPath: string; exposeSwaggerUI: boolean; exposeApiDocs: boolean; apiDocsPath: string; notRequiredAsNullable: boolean; swaggerUiOptions: any; multiple: boolean; }}
   */
  private getOpenApiConfiguration () {
    // definition to cast types received from configuration
    interface ContactObject {
      name: string;
      url?: string;
      email?: string;
    }
    interface LicenseObject {
      name: string;
      url?: string;
      email?: string;
    }
    interface InfoObject {
      title: string;
      version: string;
      description?: string;
      termsOfService?: string;
      contact?: ContactObject;
      license?: LicenseObject;
    }
    interface SecurityObject {
      type: string;
      scheme: string;
    }
    interface Security {
      [key: string]: SecurityObject;
    }
    return {
      info: this.configurationOpenApi.info as InfoObject,
      security: this.configurationOpenApi.security as Security,
      baseDir: __dirname,
      // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
      filesPattern: './rest/routes/**/*.routes.ts',
      // URL where SwaggerUI will be rendered
      swaggerUIPath: this.configurationOpenApi['swagger-ui-path'] as string,
      // Expose OpenAPI UI
      exposeSwaggerUI: this.configurationOpenApi['swagger-ui'] as boolean,
      // Expose Open API JSON Docs documentation in `apiDocsPath` path.
      exposeApiDocs: this.configurationOpenApi['swagger-json'] as boolean,
      // Open API JSON Docs endpoint.
      apiDocsPath: this.configurationOpenApi['swagger-json-path'] as string,
      // Set non-required fields as nullable by default
      notRequiredAsNullable: false,
      // You can customize your UI options.
      // you can extend swagger-ui-express config. You can checkout an example of this
      // in the `example/configuration/swaggerOptions.js`
      swaggerUiOptions: {} as SwaggerUiOptions,
      // multiple option in case you want more that one instance
      multiple: true
    };
  }

  /**
   * Initialize the configuration of routes and middleware for the server by using configuration
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async config(): Promise<void> {
    // TODO pass the 2mb as a configuration parameter
    this.app.use(express.json({limit: '2mb'}));
    this.app.use(express.urlencoded({ extended: false }));

    // TODO pass the rate limit as a configuration parameter
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 2000, // limit 2000 requests / 15min / ip (40 threads in production -store memmory used- => 320000/h/ip ==> 5333 /min/ip )
      message: 'Too many requests from this IP, please wait a moment.',
      onLimitReached: function (req) { // , res, options
        logger.warn(req.ip + ' rateLimit reached');
      }
    });
    if (this.configurationOpenApi['swagger-json'] || this.configurationOpenApi['swagger-ui']) {
      logger.info('init: OpenAPI Swagger...');
      expressJSDocSwagger(this.app)(this.getOpenApiConfiguration());
      logger.info('   OpenAPI Swagger UI initialized' +(this.configurationOpenApi['swagger-json'] ? ' at ' + this.configurationOpenApi['swagger-ui-path'] : 'DISABLED'));
      logger.info('   OpenAPI Swagger JSON initialized' +(this.configurationOpenApi['swagger-ui'] ? ' at ' + this.configurationOpenApi['swagger-json-path'] : 'DISABLED'));
    } else {
      logger.info('disabled: OpenAPI Swagger');
    }
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
    // TODO pass the activation of ping a configuration parameter
    logger.info ('init: ping');
    this.app.all( '/ping', function(req, res) {
      res.status(200).send({'status': 'pong'});
    });
    logger.info ('init: middleware');
    this.app.use(middlewares);

    // Routes
    logger.info ('init: routes');
    const routerRoutes = express.Router();
    this.app.use(await initializeRoutes(routerRoutes));

    // Middleware de gestion des erreurs (mis en dernier pour gérer les 404)
    logger.info ('init: error management middleware');
    // Handle not found the path as a 404 HTTP
    this.app.all( '*', function(req, res) {
      res.status(404).send({'error': 'ressource not found'});
    });
    this.app.use(errorMiddleware);
  }

  /**
   * Public init and launch server routine
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async launch(): Promise<void> {
    if (this.configuration['clustering']) {
      if ((typeof cluster.isPrimary !== 'undefined' && cluster.isPrimary) || (typeof cluster.isMaster !== 'undefined' && cluster.isMaster)) {
        logger.log(`Master ${process.pid} is running`);
        const nbSubProcess = Math.max(1, Math.round(os.cpus().length / 2));
        for (let i = 0; i < nbSubProcess; i++) {
          cluster.fork();
        }
        // this.launchServer(true);
        cluster.on('exit', (worker, _code, _signal) => {
          logger.warn(`worker ${worker.process.pid} died`, _code, _signal);
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



  /**
   * Internal launch server routine
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @protected
   */
  protected launchServer(_isMaster = false): void {
    if (this.configuration['https'] && this.configuration['https']['activated']) {
      const privateKey = fs.readFileSync(this.configuration['https']['private_key_filepath'], 'utf8');
      const certificate = fs.readFileSync(this.configuration['https']['public_cert_filepath'], 'utf8');
      const credentials = {key: privateKey, cert: certificate};
      const httpsServer = WebSocketServer.launchSocketServer(https.createServer(credentials, this.app), this.configuration['clustering'] as boolean, _isMaster);

      const port = this.configuration['port'] || 3443;
      httpsServer.listen(this.configuration['host'] ? {'port': port, 'host': this.configuration['host']} : port);
      logger.success(`API worker ${process.pid} listening on port ${port} (HTTPS)`);
    } else {
      const port = this.configuration['port'] || 3000;
      // this.app.listen(port, () => logger.success(`API worker ${process.pid} listening on port ${port} (HTTP)`));
      const httpServer = WebSocketServer.launchSocketServer(http.createServer(this.app));
      httpServer.listen(this.configuration['host'] ? {'port': port, 'host': this.configuration['host']} : port);
      logger.success(`API worker ${process.pid} listening on port ${port} (HTTP)`);
    }
  }
}
