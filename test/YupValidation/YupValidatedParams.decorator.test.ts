import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { YupValidatedParams } from '../../src';
import * as Yup from 'yup';
import request from 'supertest';

const TestParamsValidationSchema = Yup.object({
  param1: Yup.number().integer().required(),
  param2: Yup.boolean().required(),
})

@Controller('/')
export class TestController {
  @Get('/case-failed/:param1/:param2')
  async caseFailed(
    @YupValidatedParams(TestParamsValidationSchema) params: Yup.InferType<typeof TestParamsValidationSchema>,
  ) {
    return params
  }

  @Get('/case-success/:param1/:param2')
  async caseSuccess(
    @YupValidatedParams(TestParamsValidationSchema) params: Yup.InferType<typeof TestParamsValidationSchema>,
  ) {
    return params
  }
}

describe('YupValidatedParams', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test params failed.`, () => {
    return request(app.getHttpServer())
      .get('/case-failed/3.1415926/notboolean')
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'param1 must be an integer',
          'param2 must be a `boolean` type, but the final value was: `"notboolean"`.'
        ],
        error: 'Bad Request: ValidationError'
      });
  });

  it(`test params success.`, () => {
    return request(app.getHttpServer())
      .get('/case-success/10/true')
      .expect(200)
      .expect({
        param1: 10,
        param2: true,
      })
  });
});