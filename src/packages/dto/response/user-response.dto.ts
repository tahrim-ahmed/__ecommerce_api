import { CustomUserGroupDto } from '../user/custom-user-group.dto';
import { CustomUserPermissionDto } from '../user/custom-user-permission.dto';

export class UserResponseDto {
  userID: string;
  userName: string;
  email: string;
  phone: string;
  accessToken: string;
  group: CustomUserGroupDto[];
  permission: CustomUserPermissionDto[];

  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}
