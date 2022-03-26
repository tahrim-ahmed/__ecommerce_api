import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { RoleService } from '../role/service/role.service';
import { RoleController } from '../role/controller/role.controller';
import { UserEntity } from '../../packages/entities/user/user.entity';
import { GroupEntity } from '../../packages/entities/user/group.entity';
import { UserGroupEntity } from '../../packages/entities/user/user-group.entity';
import { ResponseService } from '../../packages/services/response.service';
import { BcryptService } from '../../packages/services/bcrypt.service';
import { ExceptionService } from '../../packages/services/exception.service';
import { RequestService } from '../../packages/services/request.service';
import { PermissionService } from '../../packages/services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GroupEntity, UserGroupEntity])],
  exports: [UserService],
  providers: [
    UserService,
    RoleService,
    ResponseService,
    BcryptService,
    ExceptionService,
    RequestService,
    PermissionService,
  ],
  controllers: [UserController, RoleController],
})
export class UserModule {}
