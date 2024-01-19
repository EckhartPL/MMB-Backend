import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentInterface } from 'types';

import { ArticleEntity } from './article.entity';

import { UserEntity } from '../../../modules/user/entities/user.entity';

@Entity()
export class CommentEntity extends BaseEntity implements CommentInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;
}
