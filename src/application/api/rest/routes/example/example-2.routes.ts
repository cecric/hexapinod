import { apiCallWrapper } from '@application/api/apicallwrapper';
import { Example } from '@core/example/models/example';
import { ExampleUsecases } from '@core/example/usecases/example.usecases';
import express from 'express';
import jwtauthmiddleware from '../../middlewares/example/jwtauth.middleware';

const router = express.Router();


router.get('/protected-path/example', jwtauthmiddleware, apiCallWrapper(async (_req, _res) => {
  const responseContent: Example = await ExampleUsecases.exampleRepositoryAction();
  _res.status(200).send(responseContent.toObject());
}));

export default router;