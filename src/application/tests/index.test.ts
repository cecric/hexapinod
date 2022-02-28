import * as dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config({ path: decodeURI(new URL('.', import.meta.url).pathname) + '../../../.env.test' });


/**
 * 'Hello world' test
 * @date 21/10/2021 - 13:50:44
 * @author cecric
 *
 * @returns {string} Hello world
 */
function hello(): string {
  return 'Hello World!';
}

describe('Hello function', () => {
  it('should return hello world', () => {
    const result = hello();
    expect(result).to.equal('Hello World!');
  });
});


