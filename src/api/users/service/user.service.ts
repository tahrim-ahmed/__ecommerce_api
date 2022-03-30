import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from '../../../packages/entities/user/user.entity';
import { GroupEntity } from '../../../packages/entities/user/group.entity';
import { UserGroupEntity } from '../../../packages/entities/user/user-group.entity';
import { ResponseService } from '../../../packages/services/response.service';
import { ExceptionService } from '../../../packages/services/exception.service';
import { BcryptService } from '../../../packages/services/bcrypt.service';
import { RequestService } from '../../../packages/services/request.service';
import { UserResponseDto } from '../../../packages/dto/response/user-response.dto';
import { UserDto } from '../../../packages/dto/user/user.dto';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { RoleName } from '../../../packages/enum/group-name.enum';
import { ChangePasswordDto } from '../../../packages/dto/user/change-password.dto';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';
import { UserGroupDto } from '../../../packages/dto/user/user-group.dto';
import { UserType } from '../../../packages/enum/group-type.enum';
import { CreateUserDto } from '../../../packages/dto/user/create/create-user.dto';
import { PermissionEntity } from '../../../packages/entities/user/permission.entity';
import { UserPermissionEntity } from '../../../packages/entities/user/user-permission.entity';
import { PermissionName } from '../../../packages/enum/permission-name.enum';
import { PermissionTypeEnum } from '../../../packages/enum/permission-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(GroupEntity)
    private readonly roleRepository: Repository<GroupEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserGroupEntity)
    private readonly userRoleRepository: Repository<UserGroupEntity>,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepository: Repository<UserPermissionEntity>,
    private readonly configService: ConfigService,
    private readonly responseService: ResponseService,
    private readonly exceptionService: ExceptionService,
    private readonly bcryptService: BcryptService,
    private readonly requestService: RequestService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  getLoggedUser = (): UserResponseDto => {
    return this.request['_user'] as UserResponseDto;
  };

  findAll = async (): Promise<UserDto[]> => {
    try {
      const users = await this.userRepository.find();
      return plainToInstance(UserDto, users);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findOne = async (dto: UserDto): Promise<UserDto> => {
    try {
      const user = await this.userRepository.findOne({
        ...dto,
      });
      this.exceptionService.notFound(user, 'User is not found');
      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findOneByEmailOrPhone = async (
    emailOrPhone: string,
    mustReturn = false,
  ): Promise<UserDto> => {
    try {
      const query = this.userRepository.createQueryBuilder('user');

      const user = await query
        .where('(user.phone = :phone OR user.email = :email)', {
          phone: emailOrPhone,
          email: emailOrPhone,
        })
        .getOne();

      if (!mustReturn) {
        this.exceptionService.notFound(
          user,
          'User is not found by phone or email',
        );
      }

      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  registration = async (userDto: UserDto): Promise<UserDto> => {
    try {
      const user = await this.createUser(userDto);

      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (userDto: CreateUserDto): Promise<UserDto> => {
    try {
      const user = await this.createNewUser(userDto);

      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  createUser = async (userDto: UserDto): Promise<UserEntity> => {
    userDto.password = await this.bcryptService.hashPassword(userDto.password);

    userDto = this.requestService.forCreate(userDto);
    const user = this.userRepository.create(userDto);

    const savedUser = await this.userRepository.save(user);

    this.createUserTypeRole(savedUser);
    this.createUserTypePermission(savedUser);

    return savedUser;
  };

  createNewUser = async (createUserDto: CreateUserDto): Promise<UserEntity> => {
    createUserDto.password = await this.bcryptService.hashPassword(
      createUserDto.password,
    );

    let userDto = createUserDto as UserDto;
    userDto = this.requestService.forCreate(userDto);
    const user = this.userRepository.create(userDto);

    const savedUser = await this.userRepository.save(user);

    switch (createUserDto.type) {
      case UserType.SUPER_ADMIN: {
        await this.createNewUserTypeRole(savedUser, RoleName.SUPER_ADMIN);
        break;
      }
      case UserType.ADMIN: {
        await this.createNewUserTypeRole(savedUser, RoleName.ADMIN);
        break;
      }
      case UserType.MANAGEMENT: {
        await this.createNewUserTypeRole(savedUser, RoleName.MANAGEMENT);
        break;
      }
      case UserType.SELLER: {
        await this.createNewUserTypeRole(savedUser, RoleName.SELLER);
        break;
      }
      case UserType.DELIVERY: {
        await this.createNewUserTypeRole(savedUser, RoleName.DELIVERY);
        break;
      }
      case UserType.CUSTOMER: {
        await this.createNewUserTypeRole(savedUser, RoleName.CUSTOMER);
        break;
      }
    }

    switch (createUserDto.permissionType) {
      case PermissionTypeEnum.SUPER_ADMIN: {
        await this.createNewUserTypePermission(
          savedUser,
          PermissionName.SUPER_ADMIN,
        );
        break;
      }
      case PermissionTypeEnum.ADMIN: {
        await this.createNewUserTypePermission(savedUser, PermissionName.ADMIN);
        break;
      }
      case PermissionTypeEnum.MANAGEMENT: {
        await this.createNewUserTypePermission(
          savedUser,
          PermissionName.MANAGEMENT,
        );
        break;
      }
      case PermissionTypeEnum.SELLER: {
        await this.createNewUserTypePermission(
          savedUser,
          PermissionName.SELLER,
        );
        break;
      }
      case PermissionTypeEnum.DELIVERY: {
        await this.createNewUserTypePermission(
          savedUser,
          PermissionName.DELIVERY,
        );
        break;
      }
      case PermissionTypeEnum.CUSTOMER: {
        await this.createNewUserTypePermission(
          savedUser,
          PermissionName.CUSTOMER,
        );
        break;
      }
    }
    return savedUser;
  };

  createUserTypeRole = async (user: UserEntity): Promise<boolean> => {
    let userRole = new UserGroupEntity();
    userRole.user = user;
    userRole.group = await this.getUserRole();
    userRole = this.requestService.forCreate(userRole);
    return Promise.resolve(!!(await this.userRoleRepository.save(userRole)));
  };

  createNewUserTypeRole = async (
    user: UserEntity,
    group: RoleName,
  ): Promise<boolean> => {
    let userRole = new UserGroupEntity();
    userRole.user = user;
    userRole.group = await this.getGroupByName(group);
    userRole = this.requestService.forCreate(userRole);
    return Promise.resolve(!!(await this.userRoleRepository.save(userRole)));
  };

  createUserTypePermission = async (user: UserEntity): Promise<boolean> => {
    let userPermission = new UserPermissionEntity();
    userPermission.user = user;
    userPermission.permission = await this.getUserPermission();
    userPermission = this.requestService.forCreate(userPermission);
    return Promise.resolve(
      !!(await this.userPermissionRepository.save(userPermission)),
    );
  };

  createNewUserTypePermission = async (
    user: UserEntity,
    permission: PermissionName,
  ): Promise<boolean> => {
    let userPermission = new UserPermissionEntity();
    userPermission.user = user;
    userPermission.permission = await this.getPermissionByName(permission);
    userPermission = this.requestService.forCreate(userPermission);
    return Promise.resolve(
      !!(await this.userPermissionRepository.save(userPermission)),
    );
  };

  update = async (id: string, userDto: UserDto): Promise<UserDto> => {
    try {
      if (userDto.password) {
        userDto.password = await this.bcryptService.hashPassword(
          userDto.password,
        );
      }

      const savedUser = await this.getUser(id);

      userDto = this.requestService.forUpdate(userDto);

      const updatedUser = await this.userRepository.save({
        ...savedUser,
        ...userDto,
      });

      return plainToClass(UserDto, updatedUser);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  updatePassword = async (
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserDto> => {
    try {
      const savedUser = await this.getUser(changePasswordDto.userID);

      savedUser.password = await this.bcryptService.hashPassword(
        changePasswordDto.newPassword,
      );
      const updatedUser = await this.userRepository.save({
        ...savedUser,
        // save password reset time
        lastPasswdGen: new Date(),
      });

      return plainToClass(UserDto, updatedUser);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedUser = await this.userRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedUser.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };

  pagination = async (
    page: number,
    limit: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<[UserDto[], number]> => {
    try {
      const query = this.userRepository.createQueryBuilder('q');

      if (search) {
        query.andWhere(
          '((q.firstName LIKE  :search) OR (q.lastName LIKE  :search) OR (q.phone LIKE  :search) OR (q.email LIKE  :search))',
          { search: `%${search}%` },
        );
      }

      if (sort && sort !== 'undefined') {
        if (order && order !== 'undefined') {
          let direction: 'DESC' | 'ASC' = 'DESC';
          if (['DESC', 'ASC'].includes(order.toUpperCase())) {
            direction = order.toUpperCase() as 'DESC' | 'ASC';
            query.orderBy(`q.${sort}`, direction);
          } else {
            query.orderBy(`q.${sort}`, direction);
          }
        } else {
          query.orderBy(`q.${sort}`, 'DESC');
        }
      } else {
        query.orderBy(`q.updatedAt`, 'DESC');
      }

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(UserDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  findById = async (id: string, relation = true): Promise<UserDto> => {
    try {
      const user = await this.userRepository.findOne(
        { id },
        {
          relations: relation ? ['groups', 'permissions'] : [],
        },
      );
      this.exceptionService.notFound(user, 'User is not found');
      user.password = undefined;
      return plainToClass(UserDto, user);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /************************ relation *******************/
  getUser = async (id: string): Promise<UserEntity> => {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    this.exceptionService.notFound(user, 'User not found!!');
    return user;
  };

  getRole = async (id: string): Promise<GroupEntity> => {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    this.exceptionService.notFound(role, 'Role not found!!');
    return role;
  };

  getUserRole = async (): Promise<GroupEntity> => {
    return await this.roleRepository.findOne({
      where: {
        role: RoleName.CUSTOMER,
      },
    });
  };

  getUserPermission = async (): Promise<PermissionEntity> => {
    return await this.permissionRepository.findOne({
      where: {
        permission: PermissionName.CUSTOMER,
      },
    });
  };

  /************************ for login *******************/

  findRolesByUserId = async (id: string): Promise<UserGroupDto[]> => {
    try {
      const query = this.userRoleRepository.createQueryBuilder('userRole');
      const userRoles = await query
        .innerJoin('userRole.user', 'user', 'user.id=:id', { id })
        .innerJoinAndSelect('userRole.group', 'group')
        .getMany();
      return plainToClass(UserGroupDto, userRoles);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  getGroupByName = async (group: RoleName): Promise<GroupEntity> => {
    const groupByName = await this.roleRepository.findOne({
      where: {
        group,
      },
    });
    this.exceptionService.notFound(groupByName, 'Group not found!!');
    return groupByName;
  };

  getPermissionByName = async (
    permission: PermissionName,
  ): Promise<PermissionEntity> => {
    const permissionByName = await this.permissionRepository.findOne({
      where: {
        permission,
      },
    });
    this.exceptionService.notFound(permissionByName, 'Permission not found!!');
    return permissionByName;
  };
}
