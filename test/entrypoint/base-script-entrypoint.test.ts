import { afterAll, describe, expect, it, jest } from '@jest/globals';
import { Injectable, Module } from '@nestjs/common';
import { BaseScriptEntrypoint } from '../../src';

@Module({})
class TestScriptModule {}

@Injectable()
class TestEntrypoint extends BaseScriptEntrypoint {

  async execute() {

  }
}

const realProcessExit = process.exit;
process.exit = jest.fn(() => { throw "mockExit"; });
afterAll(() => { process.exit = realProcessExit; });

describe('BaseScriptEntrypoint', () => {
  it(`test run app based on BaseScriptEntrypoint.`, async () => {
    try {
      await TestEntrypoint.bootstrap(TestScriptModule, { logger: false });
    } catch (error) {
        expect(error).toBe("mockExit");
        expect(process.exit).toBeCalledWith(0);
    }
  });
});