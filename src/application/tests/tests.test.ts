/* eslint-disable no-unused-expressions */
import { ExampleTestUsecases } from '@core/example/usecases/example.test.usecases';
import { expect } from 'chai';

describe('test usecase -> test action', () => {
  it('should return ok:true', async () => {
    const result = await ExampleTestUsecases.testAction();
    expect(result['ok']).to.be.true;
  });
});