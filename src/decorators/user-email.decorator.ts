import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";

export const UserEmail = createParamDecorator((date: unknown, ctx: ExecutionContext) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = ctx.switchToHttp().getRequest();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return request.user;
});
