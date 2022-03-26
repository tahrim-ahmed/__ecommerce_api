import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../packages/entities/user/user.entity';
import { GroupEntity } from '../../../packages/entities/user/group.entity';
import { UserGroupEntity } from '../../../packages/entities/user/user-group.entity';
import { BcryptService } from '../../../packages/services/bcrypt.service';
import { usersObject } from '../../../packages/json/users.json';
import { RoleName } from '../../../packages/enum/group-name.enum';
import { UserDto } from '../../../packages/dto/user/user.dto';
import { PermissionEntity } from '../../../packages/entities/user/permission.entity';
import { UserPermissionEntity } from '../../../packages/entities/user/user-permission.entity';
import { PermissionName } from '../../../packages/enum/permission-name.enum';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(GroupEntity)
    private readonly roleRepository: Repository<GroupEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserGroupEntity)
    private readonly userGroupRepository: Repository<UserGroupEntity>,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepository: Repository<UserPermissionEntity>,
    private bcryptService: BcryptService,
  ) {}

  async initUsers(): Promise<boolean> {
    await this.createUsers();
    return true;
  }

  async createUsers(): Promise<boolean> {
    try {
      for (const userObject of usersObject) {
        await this.createUser(userObject);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async createUser(userObject: any): Promise<boolean> {
    try {
      const userDto = await this.generateUserDto(userObject);
      const user = this.userRepository.create(userDto);

      await this.userRepository.save(user);

      const userGroup = new UserGroupEntity();
      userGroup.user = user;
      userGroup.group = await this.roleRepository.findOne({
        group: userObject.group as RoleName,
      });
      userGroup.createdAt = new Date();
      userGroup.updatedAt = new Date();
      await this.userGroupRepository.save(userGroup);

      const userPermission = new UserPermissionEntity();
      userPermission.user = user;
      userPermission.permission = await this.permissionRepository.findOne({
        permission: userObject.permission as PermissionName,
      });
      userPermission.createdAt = new Date();
      userPermission.updatedAt = new Date();
      await this.userPermissionRepository.save(userPermission);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async generateUserDto(userObject: any): Promise<UserDto> {
    const userDto = new UserDto();
    userDto.createdAt = new Date();
    userDto.updatedAt = new Date();
    userDto.firstName = userObject.firstName;
    userDto.lastName = userObject.lastName;
    userDto.email = userObject.email;
    userDto.phone = userObject.phone;
    userDto.password = await this.bcryptService.hashPassword(
      userObject.password,
    );
    return userDto;
  }

  count = async (): Promise<number> => {
    return await this.userRepository.count();
  };
}
