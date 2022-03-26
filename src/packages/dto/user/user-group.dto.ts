import { Type } from 'class-transformer';
import { GroupDto } from './group.dto';
import { UserDto } from './user.dto';
import { BaseDto } from '../core/base.dto';
import { PermissionDto } from './permission.dto';

export class UserGroupDto extends BaseDto {
  @Type(() => UserDto)
  user: UserDto;

  @Type(() => GroupDto)
  group: GroupDto;

  @Type(() => PermissionDto)
  permission: PermissionDto;
}
