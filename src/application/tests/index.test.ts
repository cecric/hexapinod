import * as dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config({ path: __dirname + '/../../../.env.test' });

function hello() {
  return 'Hello World!';
}

describe('Hello function', () => {
  it('should return hello world', () => {
    const result = hello();
    expect(result).to.equal('Hello World!');
  });
});


