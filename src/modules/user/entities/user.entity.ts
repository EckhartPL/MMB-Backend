import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserInterface } from 'types/user';

import {
  ArticleEntity,
  CommentEntity,
} from '../../../modules/article/entities';
import { UploadEntity } from '../../../modules/upload/entities';

@Entity()
export class UserEntity extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    nullable: false,
    type: 'varchar',
  })
  pwdHash: string;
  @Column({
    nullable: true,
    default: null,
    length: 255,
  })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedAt: Date;

  @Column()
  hashedRt?: string;

  @ManyToMany(() => ArticleEntity, (entity) => entity.likedBy)
  @JoinTable()
  likedArticles?: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments?: CommentEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.user)
  article?: ArticleEntity[];

  @OneToOne(() => UploadEntity, (uploads) => uploads.user)
  @JoinColumn()
  profilePicture: UploadEntity;
}
