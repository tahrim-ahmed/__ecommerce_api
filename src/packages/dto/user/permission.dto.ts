import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { UserGroupDto } from './user-group.dto';
import { BooleanType } from '../../enum/boolean-type.enum';

export class PermissionDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(65, { message: 'Maximum 65 character supported' })
  permission: string;

  @ApiProperty()
  @IsString({ message: 'Must be a string' })
  @MaxLength(512, { message: 'Maximum 512 character supported' })
  description: string;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  groupList: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  groupAdd: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  groupEdit: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  groupDelete: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  permissionList: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  permissionAdd: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  permissionEdit: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  permissionDelete: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  userList: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  userAdd: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  userEdit: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  userDelete: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  categoryList: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  categoryAdd: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  categoryEdit: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  categoryDelete: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  productList: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  productAdd: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  productEdit: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  productDelete: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  orderList: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  orderAdd: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  orderEdit: BooleanType;

  @ApiProperty({ enum: BooleanType, enumName: 'payment' })
  @IsEnum(BooleanType, { message: 'Must be a valid type [0-1]' })
  orderDelete: BooleanType;

  @Type(() => UserGroupDto)
  users: UserGroupDto;
}
