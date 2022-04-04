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
import { OrderStatusService } from '../services/order-status.service';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ResponseService } from '../../../packages/services/response.service';
import { RequestService } from '../../../packages/services/request.service';
import { IntValidationPipe } from '../../../packages/pipes/int-validation.pipe';
import { ResponseDto } from '../../../packages/dto/response/response.dto';
import { DtoValidationPipe } from '../../../packages/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../packages/pipes/uuid-validation.pipe';
import { OrderStatusDto } from '../../../packages/dto/order-status/order-status.dto';

@ApiTags('Order-Status')
@ApiBearerAuth()
@Controller('order-status')
export class OrderStatusController {
  constructor(
    private orderStatusService: OrderStatusService,
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
    const allOrderStatus = this.orderStatusService.search(page, limit, search);
    return this.responseService.toPaginationResponse(
      HttpStatus.OK,
      null,
      page,
      limit,
      allOrderStatus,
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
    const allOrderStatus = this.orderStatusService.pagination(
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
      allOrderStatus,
    );
  }

  @ApiCreatedResponse({
    description: 'Order-Status successfully added!!',
  })
  @ApiBody({ type: OrderStatusDto })
  @Post()
  create(
    @Body(
      new DtoValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    orderStatusDto: OrderStatusDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forCreate(orderStatusDto);
    const orderStatus = this.orderStatusService.create(modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.CREATED,
      'Order-Status successfully added!!',
      orderStatus,
    );
  }

  @ApiOkResponse({
    description: 'Order-Status successfully updated!!',
  })
  @ApiBody({ type: OrderStatusDto })
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
    orderStatusDto: OrderStatusDto,
  ): Promise<ResponseDto> {
    const modifiedDto = this.requestService.forUpdate(orderStatusDto);
    const orderStatus = this.orderStatusService.update(id, modifiedDto);
    return this.responseService.toDtoResponse(
      HttpStatus.OK,
      'Order-Status successfully updated!!',
      orderStatus,
    );
  }

  @ApiOkResponse({ description: 'Order-Status successfully deleted!' })
  @Delete(':id')
  remove(
    @Param('id', new UuidValidationPipe()) id: string,
  ): Promise<ResponseDto> {
    const deleted = this.orderStatusService.remove(id);
    return this.responseService.toResponse(
      HttpStatus.OK,
      'Order-Status successfully deleted!',
      deleted,
    );
  }
}
