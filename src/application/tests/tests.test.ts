/* eslint-disable no-unused-expressions */
import { TestUsecases } from '@core/usecases/test.usecases';
import { expect } from 'chai';

describe('test usecase -> test action', () => {
  it('should return ok:true', async () => {
    const result = await TestUsecases.testAction();
    expect(result['ok']).to.be.true;
  });
});