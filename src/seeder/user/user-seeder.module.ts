import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupSeeder } from './services/group.seeder';
import { UserService } from './services/user.service';
import { UserSeeder } from './services/user.seeder';
import { UserEntity } from '../../packages/entities/user/user.entity';
import { GroupEntity } from '../../packages/entities/user/group.entity';
import { UserGroupEntity } from '../../packages/entities/user/user-group.entity';
import { BcryptService } from '../../packages/services/bcrypt.service';
import { UserPermissionEntity } from '../../packages/entities/user/user-permission.entity';
import { PermissionSeeder } from './services/permission.seeder';
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
  providers: [
    BcryptService,
    UserSeeder,
    GroupSeeder,
    PermissionSeeder,
    UserService,
  ],
  exports: [UserService],
})
export class UserSeederModule {}
