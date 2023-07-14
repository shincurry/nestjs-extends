import { beforeEach, describe, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { Controller, INestApplication, Post } from '@nestjs/common';
import { ZodValidatedBody } from '../../src';
import { z } from 'zod';
import request from 'supertest';

const TestBodyValidationSchema = z.object({
  text: z.string(),
  id: z.number().int(),
  isDesktop: z.boolean(),
}).required()

@Controller('/')
export class TestController {
  @Post('/case-failed')
  async caseFailed(
    @ZodValidatedBody(TestBodyValidationSchema) body: z.infer<typeof TestBodyValidationSchema>,
  ) {
    return body
  }

  @Post('/case-success')
  async caseSuccess(
    @ZodValidatedBody(TestBodyValidationSchema) body: z.infer<typeof TestBodyValidationSchema>,
  ) {
    return body
  }
}

describe('ZodValidatedBody', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`test body failed.`, () => {
    const body = {
      id: 3.1415926,
      isDesktop: 'notboolean',
    }
    return request(app.getHttpServer())
      .post('/case-failed')
      .send(body)
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'text: Required.',
          'id: Expected integer, received float.',
          'isDesktop: Expected boolean, received string.'
        ],
        error: 'Bad Request: ValidationError'
      });
  });

  it(`test body success.`, () => {
    const body = {
      text: 'abc',
      id: 10,
      isDesktop: true,
    }
    return request(app.getHttpServer())
      .post('/case-success')
      .send(body)
      .expect(201)
      .expect(body)
  });
});