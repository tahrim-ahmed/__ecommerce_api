import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ColorDetailsDto } from '../color-details/color-details.dto';

export class CreateColorDetailsDto extends ColorDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('all', { message: 'Must be a valid product ID' })
  productID: string;
}
