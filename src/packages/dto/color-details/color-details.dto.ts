import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../core/base.dto';
import { ProductDto } from '../product/product.dto';

export class ColorDetailsDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name can not be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Type(() => ProductDto)
  product: ProductDto;
}
