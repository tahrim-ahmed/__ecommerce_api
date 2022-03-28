import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { GroupService } from '../group/service/group.service';
import { GroupController } from '../group/controller/group.controller';
import { UserEntity } from '../../packages/entities/user/user.entity';
import { GroupEntity } from '../../packages/entities/user/group.entity';
import { UserGroupEntity } from '../../packages/entities/user/user-group.entity';
import { ResponseService } from '../../packages/services/response.service';
import { BcryptService } from '../../packages/services/bcrypt.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';
import { UserPermissionEntity } from '../../packages/entities/user/user-permission.entity';
import { PermissionEntity } from '../../packages/entities/user/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GroupEntity,
      PermissionEntity,
      UserGroupEntity,
      UserPermissionEntity,
    ]),
  ],
  exports: [UserService],
  providers: [
    UserService,
    GroupService,
    PermissionService,
    ResponseService,
    BcryptService,
    ExceptionService,
    RequestService,
  ],
  controllers: [UserController, GroupController],
})
export class UserModule {}
