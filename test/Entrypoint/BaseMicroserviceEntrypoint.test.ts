import { describe, it } from '@jest/globals';
import { Injectable, Module } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { BaseMicroserviceEntrypoint } from '../../src';

@Module({})
class TestMicroserviceModule {}

@Injectable()
class TestMicroservice extends BaseMicroserviceEntrypoint {
}

describe('BaseMicroserviceEntrypoint', () => {
  it(`test run app based on BaseMicroserviceEntrypoint.`, async () => {
    const app = await TestMicroservice.boostrap(TestMicroserviceModule, {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 19485,
      },
      logger: false,
    });
    await app.close();
  });
});