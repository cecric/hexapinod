import { apiCallWrapper } from '@application/api/apicallwrapper';
import { Example } from '@core/example/models/example';
import { ExampleUsecases } from '@core/example/usecases/example.usecases';
import express from 'express';

const router = express.Router();

router.get('/example', apiCallWrapper(async (_req, _res) => {
  const content: Example = await ExampleUsecases.exampleValidatorAction();
  _res.status(200).send(content.toObject());
}));

export default router;