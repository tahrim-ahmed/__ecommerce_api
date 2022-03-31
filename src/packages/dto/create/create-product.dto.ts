import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ProductDto } from '../product/product.dto';

export class CreateProductDto extends ProductDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Sub-category ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid sub-category ID' })
  subCategoryID: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Brand ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid brand ID' })
  brandID: string;
}
