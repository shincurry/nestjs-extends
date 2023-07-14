import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { ZodValidatedParam } from '../../src';
import { z } from 'zod';
import request from 'supertest';

@Controller('/')
export class TestController {
  @Get('/case-failed/:id')
  async caseFailed(
    @ZodValidatedParam("id", z.number().int()) id: number,
  ) {
    return { id }
  }

  @Get('/case-success/:id')
  async caseSuccess(
    @ZodValidatedParam("id", z.coerce.number().int()) id: number,
  ) {
    return { id }
  }
}

describe('ZodValidatedParam', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test param failed.`, () => {
    return request(app.getHttpServer())
      .get('/case-failed/textid')
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'Expected number, received string.'
        ],
        error: 'Bad Request: ValidationError'
      });
  });

  it(`test param success.`, () => {
    return request(app.getHttpServer())
      .get('/case-success/1')
      .expect(200)
      .expect({ id: 1 });
  });

});