import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { SubCategoryDto } from '../category/sub-category.dto';
import { BrandDto } from '../brand/brand.dto';

export class ProductDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name can not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name less than 256 characters' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description can not be empty' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description less than 1000 characters' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'price can not be empty' })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  discount: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'quantity can not be empty' })
  @IsNumber()
  quantity: string;

  @Type(() => SubCategoryDto)
  subCategory: SubCategoryDto;

  @Type(() => BrandDto)
  brand: BrandDto;
}
