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
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { SubCategoryService } from '../services/sub-category.service';
import { ResponseService } from '../../../packages/services/response.service';
import { RequestService } from '../../../packages/services/request.service';
import { IntValidationPipe } from '../../../packages/pipes/int-validation.pipe';
import { ResponseDto } from '../../../packages/dto/response/response.dto';
import { CreateSubCategoryDto } from '../../../packages/dto/create/create-sub-category.dto';
import { DtoValidationPipe } from '../../../packages/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../packages/pipes/uuid-validation.pipe';

@ApiTags('Sub-Category')
@ApiBearerAuth()
@Controller('sub-category')
export class SubCategoryController {
  constructor(
    private subCategoryService: SubCategoryService,
    private readonly responseService: ResponseService,
    private readonly requestService: RequestService,
  ) {}

  @ApiImplicitQuery({
    name: 'page',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'categoryID',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @Get('search')
  search(
    @Query('page', new IntValidationPipe()) page: number,
    @Query('limit', new IntValidationPipe()) limit: number,
    @Query('categoryID') categoryID: string,
    @Query('search') search: string,
  ): Promise<ResponseDto> {
    const allSubCategory = this.subCategoryService.search(
      page,
      limit,
      categoryID,
      search,
    );
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allSubCategory,
    );
  }

  @ApiImplicitQuery({
    name: 'page',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    type: String,
  })
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
    const allSubCategory = this.subCategoryService.pagination(
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
      allSubCategory,
    );
  }

  @ApiCreatedResponse({
    description: 'Sub-category successfully added!!',
  })
  @ApiBody({ type: CreateSubCategoryDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(createSubCategoryDto);
    const region = this.subCategoryService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Sub-category successfully added!!',
      region,
    );
  }

  @ApiOkResponse({
    description: 'Sub-category successfully updated!!',
  })
  @ApiBody({ type: CreateSubCategoryDto })
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
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(createSubCategoryDto);
    const region = this.subCategoryService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Sub-category successfully updated!!',
      region,
    );
  }

  @ApiOkResponse({ description: 'Sub-category successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.subCategoryService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Sub-category successfully deleted!',
      deleted,
    );
  }
}
