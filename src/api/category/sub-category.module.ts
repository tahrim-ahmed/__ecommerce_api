import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryController } from './controllers/sub-category.controller';
import { SubCategoryEntity } from '../../packages/entities/category/sub-category.entity';
import { SubCategoryService } from './services/sub-category.service';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';
import { CategoryModule } from './category.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryEntity]), CategoryModule],
  controllers: [SubCategoryController],
  exports: [SubCategoryService],
  providers: [
    SubCategoryService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class SubCategoryModule {}
