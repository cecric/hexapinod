import { ExampleUsecases } from '@core/example/usecases/example.usecases';
import express from 'express';
import jwtauthmiddleware from '../../middlewares/example/jwtauth.middleware';

const router = express.Router();


router.get('/protected-path/example', jwtauthmiddleware, async function (_req, _res, _next) {
  try {
    const responseContent = await ExampleUsecases.exampleAction();
    _res.status(200).send(responseContent);
    return;
  } catch (e) {
    _next(e);
  }
});

export default router;