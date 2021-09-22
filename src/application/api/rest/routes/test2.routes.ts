import { TestUsecases } from '@core/example/usecases/test.usecases';
import express from 'express';
import jwtauthmiddleware from '../middlewares/jwtauth.middleware';

const router = express.Router();


router.get('/test2', jwtauthmiddleware, async function (_req, _res, _next) {
  try {
    const responseContent = await TestUsecases.testAction();
    _res.status(200).send(responseContent);
    return;
  } catch (e) {
    _next(e);
  }
});

export default router;