import { ExampleUsecases } from '@core/example/usecases/example.usecases';
import express from 'express';

const router = express.Router();


router.get('/example', async function (_req, _res, _next) {
  try {
    const responseContent = await ExampleUsecases.exampleRepositoryAction();
    _res.status(200).send(responseContent);
    return;
  } catch (e) {
    _next(e);
  }
});

export default router;