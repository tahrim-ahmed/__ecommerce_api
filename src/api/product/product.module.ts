import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';
import { ProductEntity } from '../../packages/entities/product/product.entity';
import { SubCategoryModule } from '../category/sub-category.module';
import { BrandModule } from '../brand/brand.module';
import { ColorDetailsEntity } from '../../packages/entities/color-details/color-details.entity';
import { UnitModule } from '../unit/unit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ColorDetailsEntity]),
    SubCategoryModule,
    BrandModule,
    UnitModule,
  ],
  controllers: [ProductController],
  exports: [ProductService],
  providers: [
    ProductService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class ProductModule {}
