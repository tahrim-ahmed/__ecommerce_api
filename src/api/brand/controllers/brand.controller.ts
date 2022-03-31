import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BrandService } from '../services/brand.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ResponseService } from '../../../packages/services/response.service';
import { RequestService } from '../../../packages/services/request.service';
import { IntValidationPipe } from '../../../packages/pipes/int-validation.pipe';
import { ResponseDto } from '../../../packages/dto/response/response.dto';
import { DtoValidationPipe } from '../../../packages/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../packages/pipes/uuid-validation.pipe';
import { BrandDto } from '../../../packages/dto/brand/brand.dto';

@ApiTags('Brand')
@ApiBearerAuth()
@Controller('brand')
export class BrandController {
  constructor(
    private brandService: BrandService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {}

  @ApiImplicitQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @Get('search')
  search(
    @Query('page', new IntValidationPipe()) page: number,
    @Query('limit', new IntValidationPipe()) limit: number,
    @Query('search') search: string,
  ): Promise<ResponseDto> {
    const allBrand = this.brandService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allBrand,
    );
  }

  @ApiImplicitQuery({
    name: 'sort',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'order',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @Get('pagination')
  pagination(
    @Query('page', new IntValidationPipe()) page: number,
    @Query('limit', new IntValidationPipe()) limit: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('search') search: string,
  ): Promise<ResponseDto> {
    const allBrand = this.brandService.pagination(
      page,
      limit,
      sort,
      order,
      search,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allBrand,
    );
  }

  @ApiCreatedResponse({
    description: 'Brand successfully added!!',
  })
  @ApiBody({ type: BrandDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    brandDto: BrandDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(brandDto);
    const brand = this.brandService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Brand successfully added!!',
      brand,
    );
  }

  @ApiOkResponse({
    description: 'Brand successfully updated!!',
  })
  @ApiBody({ type: BrandDto })
  @Put(':id')
  update(
    @Param('id', new UuidValidationPipe()) id: string,
    @Body(
      new DtoValidationPipe({
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    brandDto: BrandDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(brandDto);
    const brand = this.brandService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Brand successfully updated!!',
      brand,
    );
  }

  @ApiOkResponse({ description: 'Brand successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.brandService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Brand successfully deleted!',
      deleted,
    );
  }
}
