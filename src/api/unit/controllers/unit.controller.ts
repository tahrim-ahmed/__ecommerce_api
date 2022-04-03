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
import { UnitService } from '../services/unit.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ResponseService } from '../../../packages/services/response.service';
import { RequestService } from '../../../packages/services/request.service';
import { IntValidationPipe } from '../../../packages/pipes/int-validation.pipe';
import { ResponseDto } from '../../../packages/dto/response/response.dto';
import { DtoValidationPipe } from '../../../packages/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../packages/pipes/uuid-validation.pipe';
import { UnitDto } from '../../../packages/dto/unit/unit.dto';

@ApiTags('Unit')
@ApiBearerAuth()
@Controller('unit')
export class UnitController {
  constructor(
    private unitService: UnitService,
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
    const allUnit = this.unitService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allUnit,
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
    const allUnit = this.unitService.pagination(
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
      allUnit,
    );
  }

  @ApiCreatedResponse({
    description: 'Unit successfully added!!',
  })
  @ApiBody({ type: UnitDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    unitDto: UnitDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(unitDto);
    const brand = this.unitService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Unit successfully added!!',
      brand,
    );
  }

  @ApiOkResponse({
    description: 'Unit successfully updated!!',
  })
  @ApiBody({ type: UnitDto })
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
    unitDto: UnitDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(unitDto);
    const unit = this.unitService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Unit successfully updated!!',
      unit,
    );
  }

  @ApiOkResponse({ description: 'Unit successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.unitService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Unit successfully deleted!',
      deleted,
    );
  }
}
