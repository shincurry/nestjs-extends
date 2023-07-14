import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import type { Request } from "express";
import type { ZodObject, ZodRawShape } from "zod";
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { zodMessagesFromError } from "../utils/zod-error-messages";


export function ZodValidatedBody<T extends ZodRawShape>(validationSchema: ZodObject<T>) {
  return createParamDecorator<T>(
    async (data, ctx: ExecutionContext) => {
      const Zod = loadPackage(
        'zod',
        'Zod',
        () => require('zod'),
      ) as typeof import("zod");
      const { ZodError } = Zod;
      const request = ctx.switchToHttp().getRequest<Request>();
      const body = request.body;
      try {
        return await validationSchema.parseAsync(body);
      } catch (error: any) {
        /* istanbul ignore else */
        if (error instanceof ZodError) {
          throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: zodMessagesFromError(error),
            error: "Bad Request: ValidationError"
          }, HttpStatus.BAD_REQUEST)
        } else {
          throw error
        }
      }
    },
  )();
}
