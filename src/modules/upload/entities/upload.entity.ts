import { UserEntity } from 'src/modules/user/entities';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UploadsInterface } from 'types';

@Entity('uploads')
export class UploadEntity extends BaseEntity implements UploadsInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  fileName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  url: string;

  @CreateDateColumn({ type: 'timestamp' })
  uploadedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.profilePicture)
  user: UserEntity;
}
