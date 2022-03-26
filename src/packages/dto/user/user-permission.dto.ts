import { Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { BaseDto } from '../core/base.dto';
import { PermissionDto } from './permission.dto';

export class UserPermissionDto extends BaseDto {
  @Type(() => UserDto)
  user: UserDto;

  @Type(() => PermissionDto)
  permission: PermissionDto;
}
