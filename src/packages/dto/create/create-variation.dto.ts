import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { VariationDto } from '../variation/variation.dto';

export class CreateVariationDto extends VariationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('all', { message: 'Must be a valid product ID' })
  productID: string;
}
