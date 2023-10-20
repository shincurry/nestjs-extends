import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import type { AnyZodObject } from "zod";
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { zodMessagesFromError } from "../utils/zod-error-messages";


export function ZodValidatedParams(validationSchema: AnyZodObject) {
  return createParamDecorator(
    async (data, ctx: ExecutionContext) => {
      const Zod = loadPackage(
        'zod',
        'Zod',
        () => require('zod'),
      ) as typeof import("zod");
      const { ZodError } = Zod;
      const request = ctx.switchToHttp().getRequest();
      const params = request.params;
      try {
        return await validationSchema.parseAsync(params);
      } catch (error) {
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
