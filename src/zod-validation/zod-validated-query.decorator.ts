import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import type { ZodType } from "zod";
import { zodMessagesFromError } from "../utils/zod-error-messages";


export function ZodValidatedQuery<T extends any>(name: string, validationSchema: ZodType<T>) {
  return createParamDecorator<T>(
    async (data, ctx: ExecutionContext) => {
      const Zod = loadPackage(
        'zod',
        'Zod',
        () => require('zod'),
      ) as typeof import("zod");
      const { ZodError } = Zod;
      const request = ctx.switchToHttp().getRequest();
      const query = request.query[name];
      try {
        return await validationSchema.parseAsync(query);
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
