import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './service/group.service';
import { GroupController } from './controller/group.controller';
import { GroupEntity } from '../../packages/entities/user/group.entity';
import { ResponseService } from '../../packages/services/response.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  exports: [GroupService],
  providers: [
    GroupService,
    ResponseService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
  controllers: [GroupController],
})
export class GroupModule {}
