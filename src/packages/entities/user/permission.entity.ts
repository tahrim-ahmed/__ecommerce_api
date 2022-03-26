import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { UserPermissionEntity } from './user-permission.entity';
import { BooleanType } from '../../enum/boolean-type.enum';

@Entity({ name: 'permissions' })
@Index('permissions-permission-deletedat-idx', ['permission', 'deletedAt'])
export class PermissionEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'permission', length: 65 })
  @Index('permissions-permission-idx', { unique: true })
  permission: string;

  @Column({ type: 'varchar', name: 'description', length: 255 })
  description: string;

  @Column({
    type: 'enum',
    name: 'group_list',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  groupList: BooleanType;

  @Column({
    type: 'enum',
    name: 'group_add',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  groupAdd: BooleanType;

  @Column({
    type: 'enum',
    name: 'group_edit',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  groupEdit: BooleanType;

  @Column({
    type: 'enum',
    name: 'group_delete',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  groupDelete: BooleanType;

  @Column({
    type: 'enum',
    name: 'permission_list',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  permissionList: BooleanType;

  @Column({
    type: 'enum',
    name: 'permission_add',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  permissionAdd: BooleanType;

  @Column({
    type: 'enum',
    name: 'permission_edit',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  permissionEdit: BooleanType;

  @Column({
    type: 'enum',
    name: 'permission_delete',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  permissionDelete: BooleanType;

  @Column({
    type: 'enum',
    name: 'user_list',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  userList: BooleanType;

  @Column({
    type: 'enum',
    name: 'user_add',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  userAdd: BooleanType;

  @Column({
    type: 'enum',
    name: 'user_edit',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  userEdit: BooleanType;

  @Column({
    type: 'enum',
    name: 'user_delete',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  userDelete: BooleanType;

  @Column({
    type: 'enum',
    name: 'category_list',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  categoryList: BooleanType;

  @Column({
    type: 'enum',
    name: 'category_add',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  categoryAdd: BooleanType;

  @Column({
    type: 'enum',
    name: 'category_edit',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  categoryEdit: BooleanType;

  @Column({
    type: 'enum',
    name: 'category_delete',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  categoryDelete: BooleanType;

  @Column({
    type: 'enum',
    name: 'product_list',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  productList: BooleanType;

  @Column({
    type: 'enum',
    name: 'product_add',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  productAdd: BooleanType;

  @Column({
    type: 'enum',
    name: 'product_edit',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  productEdit: BooleanType;

  @Column({
    type: 'enum',
    name: 'product_delete',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  productDelete: BooleanType;

  @Column({
    type: 'enum',
    name: 'order_list',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  orderList: BooleanType;

  @Column({
    type: 'enum',
    name: 'order_add',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  orderAdd: BooleanType;

  @Column({
    type: 'enum',
    name: 'order_edit',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  orderEdit: BooleanType;

  @Column({
    type: 'enum',
    name: 'order_delete',
    enum: BooleanType,
    default: `${BooleanType.False}`,
  })
  orderDelete: BooleanType;

  @OneToMany(
    () => UserPermissionEntity,
    (userPermissionEntity) => userPermissionEntity.permission,
  )
  @JoinColumn({ name: 'permission_id' })
  users: UserPermissionEntity;
}
