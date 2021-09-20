import { TestUsecases } from '@core/usecases/test.usecases';
import express from 'express';

const router = express.Router();


router.get('/test', async function (_req, _res, _next) {
  try {
    const responseContent = await TestUsecases.testAction();
    _res.status(200).send(responseContent);
    return;
  } catch (e) {
    _next(e);
  }
});

export default router;