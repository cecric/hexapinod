/* eslint-disable no-unused-expressions */
import { ExampleTestUsecases } from '@core/example/usecases/example.test.usecases';
import { expect } from 'chai';

describe('test usecase -> test validator action', () => {
  it('should return ok:true', async () => {
    const result = await ExampleTestUsecases.testValidatorAction();
    expect(result['ok']).to.be.true;
  });
});

describe('test usecase -> test database repositories action', () => {
  it('should return ok:true', async () => {
    const result = await ExampleTestUsecases.testDatabaseRepositoriesAction();
    expect(result['ok']).to.be.true;
  });
});

