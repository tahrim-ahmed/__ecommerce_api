import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { BcryptService } from '../../../packages/services/bcrypt.service';
import { UserService } from '../../users/service/user.service';
import { LoginDto } from '../../../packages/dto/user/login.dto';
import { UserResponseDto } from '../../../packages/dto/response/user-response.dto';
import { UserDto } from '../../../packages/dto/user/user.dto';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { UserGroupDto } from '../../../packages/dto/user/user-group.dto';
import { CustomUserGroupDto } from '../../../packages/dto/user/custom-user-group.dto';
import { RoleName } from '../../../packages/enum/group-name.enum';
import { ChangePasswordDto } from '../../../packages/dto/user/change-password.dto';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.validateUser(loginDto);

      if (user) {
        const userRoles = await this.userService.findRolesByUserId(user.id);
        const userResponseDto = await this.generatePayload(user, userRoles);

        delete user.password;

        const payload = { response: userResponseDto, user };

        return await this.generateToken(payload, loginDto.isRemembered);
      } else {
        throw new SystemException({
          message: 'User info or password is not valid',
        });
      }
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<UserDto> {
    try {
      let emailOrPhone = loginDto.phone;

      if (!emailOrPhone) {
        emailOrPhone = loginDto.email;
      }

      const user: UserDto = await this.userService.findOneByEmailOrPhone(
        emailOrPhone,
      );

      if (!user) {
        return null;
      }

      const isPasswordMatched = await this.bcryptService.comparePassword(
        loginDto.password,
        user?.password,
      );

      if (isPasswordMatched) {
        return { ...user };
      }
      return null;
    } catch (error) {
      throw new SystemException(error);
    }
  }

  async generatePayload(
    userDto: UserDto,
    userRoles: UserGroupDto[],
  ): Promise<UserResponseDto> {
    let isSuperAdmin = false;
    let isAdmin = false;
    let isCustomer = false;

    const customUserGroupDtos = [];
    for (const userRole of userRoles) {
      const customUserRoleDto = new CustomUserGroupDto();
      customUserRoleDto.group = userRole.group?.group as RoleName;

      switch (userRole.group?.group as RoleName) {
        case RoleName.SUPER_ADMIN:
          isSuperAdmin = true;
          break;
        case RoleName.ADMIN:
          isAdmin = true;
          break;
        case RoleName.CUSTOMER:
          isCustomer = true;
          break;
      }
      customUserGroupDtos.push(customUserRoleDto);
    }

    const userResponseDto = new UserResponseDto();
    userResponseDto.userID = userDto.id;
    userResponseDto.phone = userDto.phone;
    userResponseDto.userName =
      (userDto.firstName || '') + ' ' + (userDto.lastName || '');
    userResponseDto.group = customUserGroupDtos;

    userResponseDto.isSuperAdmin = isSuperAdmin;
    userResponseDto.isAdmin = isAdmin;
    userResponseDto.isCustomer = isCustomer;

    return Promise.resolve(userResponseDto);
  }

  /************* relation setter ***************/

  async generateToken(payload: any, isRemembered = 1): Promise<string> {
    const privateKEY = fs.readFileSync('env/jwtRS256.key');

    let accessToken;

    if (isRemembered === 1) {
      accessToken = jwt.sign({ ...payload }, privateKEY, {
        expiresIn: '1d',
        algorithm: 'RS256',
      });
    } else {
      accessToken = jwt.sign({ ...payload }, privateKEY, {
        expiresIn: '1h',
        algorithm: 'RS256',
      });
    }
    return Promise.resolve(accessToken);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<UserDto> {
    try {
      const user = await this.userService.updatePassword(changePasswordDto);
      if (user) {
        delete user.password;
        return Promise.resolve(user);
      } else {
        throw new SystemException({
          message: 'User phone or email is not correct',
        });
      }
    } catch (error) {
      throw new SystemException(error);
    }
  }
}
