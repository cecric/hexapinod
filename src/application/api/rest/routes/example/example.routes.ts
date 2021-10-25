import { apiCallWrapper } from '@application/api/apicallwrapper';
import { Example } from '@core/example/models/example';
import { ExampleUsecases } from '@core/example/usecases/example.usecases';
import { jwtAuthMiddleware } from '../../middlewares/example/jwtauth.middleware';
import express from 'express';

const router = express.Router();

/**
 * Example Model
 * @typedef {object} Example
 * @property {string} example - Example string
 * @property {string} date_example - Example Date
 */

/**
 * GET /example
 * @tags examples
 * @summary Example of path to be exported as OpenAPI documentation and as APIDocJS Documentation
 * @return {Example} 200 - success response - application/json
 * @api {get} /example example request
 * @apiName GetUser
 * @apiGroup examples
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/example', apiCallWrapper(async (_req, _res) => {
  const content: Example = await ExampleUsecases.exampleValidatorAction();
  _res.status(200).send(content.toObject());
}));


/**
 * @api {get} /second-example example request document with APIDocJS
 * @apiName /second-example
 * @apiGroup examples
 * @apiSuccess (200) {Example} an occurence of Success
 */
router.get('/second-example', apiCallWrapper(async (_req, _res) => {
  const content: Example = await ExampleUsecases.exampleValidatorAction();
  _res.status(200).send(content.toObject());
}));

/**
 * GET /protected-path/example
 * @summary Example of path to be exported as OpenAPI documentation
 * @tags examples
 * @security bearerAuth
 * @return {Example} 200 - success response - application/json
 */
router.get('/protected-path/example', jwtAuthMiddleware, apiCallWrapper(async (_req, _res) => {
  const responseContent: Example = await ExampleUsecases.exampleRepositoryAction();
  _res.status(200).send(responseContent.toObject());
}));

export default router;