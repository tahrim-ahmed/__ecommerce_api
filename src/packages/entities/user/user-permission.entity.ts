import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { UserEntity } from './user.entity';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'users_permissions' })
export class UserPermissionEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.permission)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => PermissionEntity,
    (permissionEntity) => permissionEntity.users,
  )
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
