import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'types';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetCurrentUserId = createParamDecorator(
  (param: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
