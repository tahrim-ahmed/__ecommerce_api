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
import { CategoryService } from '../services/category.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { CategoryDto } from '../../../packages/dto/category/category.dto';
import { ResponseService } from '../../../packages/services/response.service';
import { RequestService } from '../../../packages/services/request.service';
import { IntValidationPipe } from '../../../packages/pipes/int-validation.pipe';
import { ResponseDto } from '../../../packages/dto/response/response.dto';
import { DtoValidationPipe } from '../../../packages/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../packages/pipes/uuid-validation.pipe';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
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
    const allCategory = this.categoryService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allCategory,
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
    const allCategory = this.categoryService.pagination(
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
      allCategory,
    );
  }

  @ApiCreatedResponse({
    description: 'Category successfully added!!',
  })
  @ApiBody({ type: CategoryDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    categoryDto: CategoryDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(categoryDto);
    const category = this.categoryService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Category successfully added!!',
      category,
    );
  }

  @ApiOkResponse({
    description: 'Category successfully updated!!',
  })
  @ApiBody({ type: CategoryDto })
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
    categoryDto: CategoryDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(categoryDto);
    const category = this.categoryService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Category successfully updated!!',
      category,
    );
  }

  @ApiOkResponse({ description: 'Category successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.categoryService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Category successfully deleted!',
      deleted,
    );
  }
}
