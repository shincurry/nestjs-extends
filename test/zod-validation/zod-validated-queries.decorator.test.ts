import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { ZodValidatedQueries } from '../../src';
import { z } from 'zod';
import request from 'supertest';

const TestQueriesValidationSchema = z.object({
  q1: z.string(),
  q2: z.coerce.number().int(),
  q3: z.string().transform((val) => {
    if (val === '1') return true;
    if (val === '0') return false;
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }).pipe(z.boolean()),
})

@Controller('/')
export class TestController {
  @Get('/case-failed')
  async caseFailed(
    @ZodValidatedQueries(TestQueriesValidationSchema) queries: z.infer<typeof TestQueriesValidationSchema>,
  ) {
    return queries
  }

  @Get('/case-success')
  async caseSuccess(
    @ZodValidatedQueries(TestQueriesValidationSchema) queries: z.infer<typeof TestQueriesValidationSchema>,
  ) {
    return queries
  }
}

describe('ZodValidatedQueries', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test queries failed.`, () => {
    return request(app.getHttpServer())
      .get('/case-failed?q2=3.1415926&q3=notboolean')
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'q1: Required.',
          'q2: Expected integer, received float.',
          'q3: Expected boolean, received string.'
        ],
        error: 'Bad Request: ValidationError'
      });
  });

  it(`test queries success.`, () => {
    return request(app.getHttpServer())
      .get('/case-success?q1=text&q2=10&q3=true')
      .expect(200)
      .expect({
        q1: 'text',
        q2: 10,
        q3: true,
      })
  });
});