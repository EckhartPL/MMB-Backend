import { UserEntity } from 'src/components/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleInterface } from 'types';
import { CommentEntity } from './comment.entity';

@Entity()
export class ArticleEntity extends BaseEntity implements ArticleInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;
  @Column({
    type: 'longtext',
    nullable: false,
  })
  description: string;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    default: 0,
    nullable: false,
    unsigned: true,
  })
  likes: number;

  @ManyToMany(() => UserEntity, (entity) => entity.likedArticles)
  likedBy: UserEntity[];

  @ManyToOne(() => UserEntity, (user) => user.article)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CommentEntity, (entity) => entity.article)
  @JoinTable()
  comments: CommentEntity[];
}
