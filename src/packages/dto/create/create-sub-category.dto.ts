import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { SubCategoryDto } from '../category/sub-category.dto';

export class CreateSubCategoryDto extends SubCategoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Category ID must be defined' })
  @IsUUID('all', { message: 'Must be a valid category ID' })
  categoryID: string;
}
