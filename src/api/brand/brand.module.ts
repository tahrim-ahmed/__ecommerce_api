import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandService } from './services/brand.service';
import { BrandController } from './controllers/brand.controller';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';
import { BrandEntity } from '../../packages/entities/brand/brand.entity';
@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity])],
  controllers: [BrandController],
  exports: [BrandService],
  providers: [
    BrandService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class BrandModule {}
