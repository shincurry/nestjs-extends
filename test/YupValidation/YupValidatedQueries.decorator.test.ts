import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { YupValidatedQueries } from '../../src';
import * as Yup from 'yup';
import request from 'supertest';

const TestQueriesValidationSchema = Yup.object({
  q1: Yup.string().required(),
  q2: Yup.number().integer().required(),
  q3: Yup.boolean().required(),
})

@Controller('/')
export class TestController {
  @Get('/case-failed')
  async caseFailed(
    @YupValidatedQueries(TestQueriesValidationSchema) queries: Yup.InferType<typeof TestQueriesValidationSchema>,
  ) {
    return queries
  }

  @Get('/case-success')
  async caseSuccess(
    @YupValidatedQueries(TestQueriesValidationSchema) queries: Yup.InferType<typeof TestQueriesValidationSchema>,
  ) {
    return queries
  }
}

describe('YupValidatedQueries', () => {
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
          'q1 is a required field',
          'q2 must be an integer',
          'q3 must be a `boolean` type, but the final value was: `"notboolean"`.'
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