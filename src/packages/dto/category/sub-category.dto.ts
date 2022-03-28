import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from './category.dto';
import { BaseDto } from '../core/base.dto';

export class SubCategoryDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name can not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name less than 256 characters' })
  name: string;

  @Type(() => CategoryDto)
  category: CategoryDto;
}
