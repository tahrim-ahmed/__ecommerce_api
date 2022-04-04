import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusService } from './services/order-status.service';
import { OrderStatusController } from './controllers/order-status.controller';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';
import { OrderStatusEntity } from '../../packages/entities/order-status/order-status.entity';
@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusEntity])],
  controllers: [OrderStatusController],
  exports: [OrderStatusService],
  providers: [
    OrderStatusService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class OrderStatusModule {}
