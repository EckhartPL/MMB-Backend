import { SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const Public = () => SetMetadata('isPublic', true);
