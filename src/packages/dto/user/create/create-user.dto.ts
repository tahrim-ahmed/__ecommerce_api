import { UserType } from '../../../enum/group-type.enum';
import { UserDto } from '../user.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionTypeEnum } from '../../../enum/permission-type.enum';

export class CreateUserDto extends UserDto {
  @ApiProperty({ enum: UserType, enumName: 'user type' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsEnum(UserType, { message: 'Must be a valid user type [1-6]' })
  type: UserType;

  @ApiProperty({ enum: PermissionTypeEnum, enumName: 'permission type' })
  @IsNotEmpty({ message: 'Must be non empty' })
  @IsEnum(PermissionTypeEnum, {
    message: 'Must be a valid permission type [1-6]',
  })
  permissionType: PermissionTypeEnum;
}
