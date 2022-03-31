import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { UserGroupEntity } from './user-group.entity';
import { CustomBaseEntity } from '../core/custom-base.entity';

@Entity({ name: 'groups' })
@Index('groups-group-deletedat-idx', ['group', 'deletedAt'])
export class GroupEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'group', length: 65 })
  @Index('roles-role-idx', { unique: true })
  group: string;

  @Column({ type: 'varchar', name: 'description', length: 255 })
  description: string;

  @OneToMany(() => UserGroupEntity, (userGroupEntity) => userGroupEntity.group)
  @JoinColumn({ name: 'group_id' })
  users: UserGroupEntity;
}
