import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitService } from './services/unit.service';
import { UnitController } from './controllers/unit.controller';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';
import { UnitEntity } from '../../packages/entities/unit/unit.entity';
@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity])],
  controllers: [UnitController],
  exports: [UnitService],
  providers: [
    UnitService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
})
export class UnitModule {}
