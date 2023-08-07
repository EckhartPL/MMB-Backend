import { UserEntity } from '../../src/modules/user/entities/user.entity';

export interface UploadsInterface {
  id: string;
  url: string;
  fileOriginalName: string;
  uploadedAt: Date;
  modifiedAt: Date;
  user: UserEntity;
}
