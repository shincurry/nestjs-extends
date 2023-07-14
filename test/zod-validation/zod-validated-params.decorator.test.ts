import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { ZodValidatedParams } from '../../src';
import { z } from 'zod';
import request from 'supertest';

const TestParamsValidationSchema = z.object({
  param1: z.coerce.number().int(),
  param2: z.string().transform((val) => {
    if (val === '1') return true;
    if (val === '0') return false;
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }).pipe(z.boolean()),
})

@Controller('/')
export class TestController {
  @Get('/case-failed/:param1/:param2')
  async caseFailed(
    @ZodValidatedParams(TestParamsValidationSchema) params: z.infer<typeof TestParamsValidationSchema>,
  ) {
    return params
  }

  @Get('/case-success/:param1/:param2')
  async caseSuccess(
    @ZodValidatedParams(TestParamsValidationSchema) params: z.infer<typeof TestParamsValidationSchema>,
  ) {
    return params
  }
}

describe('ZodValidatedParams', () => {
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
          'param1: Expected integer, received float.',
          'param2: Expected boolean, received string.'
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