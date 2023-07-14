import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { ZodValidatedQuery } from '../../src';
import { z } from 'zod';
import request from 'supertest';

@Controller('/')
export class TestController {
  @Get('/case-failed')
  async caseFailed(
    @ZodValidatedQuery("q", z.coerce.number()) q: number,
  ) {
    return { q }
  }

  @Get('/case-success')
  async caseSuccess(
    @ZodValidatedQuery("q", z.coerce.number()) q: number,
  ) {
    return { q }
  }
}

describe('ZodValidatedQuery', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test query failed.`, () => {
    return request(app.getHttpServer())
      .get('/case-failed?q=text')
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'Expected number, received nan.'
        ],
        error: 'Bad Request: ValidationError'
      });
  });

  it(`test query success.`, () => {
    return request(app.getHttpServer())
      .get('/case-success?q=123')
      .expect(200)
      .expect({ q: 123 });
  });
});