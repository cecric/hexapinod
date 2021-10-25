import { apiCallWrapper } from '@application/api/apicallwrapper';
import { Example } from '@core/example/models/example';
import { ExampleUsecases } from '@core/example/usecases/example.usecases';
import express from 'express';

const router = express.Router();

/**
 * GET /example
 * @api {get} /example example request
 * @apiName GetUser
 * @apiGroup User
 * @return {object} 400 - Bad request response
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/example', apiCallWrapper(async (_req, _res) => {
  const content: Example = await ExampleUsecases.exampleValidatorAction();
  _res.status(200).send(content.toObject());
}));

export default router;