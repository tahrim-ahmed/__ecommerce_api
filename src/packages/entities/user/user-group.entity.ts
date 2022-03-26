import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { GroupEntity } from './group.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'users_groups' })
export class UserGroupEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.group)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GroupEntity, (roleEntity) => roleEntity.users)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}
