import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionName } from '../../enum/permission-name.enum';

export class CustomUserPermissionDto {
  @ApiProperty({ enum: PermissionName, enumName: 'permission name' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsEnum(PermissionName, { message: 'Must be a valid role' })
  permission: PermissionName;
}
