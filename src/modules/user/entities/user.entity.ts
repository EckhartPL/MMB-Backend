import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInterface } from 'types/user';

import {
  ArticleEntity,
  CommentEntity,
} from '../../../modules/article/entities';

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
  @Column({
    nullable: true,
    default: null,
  })
  profilePictureUrl: string;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column()
  hashedRt?: string;

  @ManyToMany(() => ArticleEntity, (entity) => entity.likedBy)
  @JoinTable()
  likedArticles?: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments?: CommentEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.user)
  article?: ArticleEntity[];
}
