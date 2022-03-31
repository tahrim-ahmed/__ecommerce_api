import { CustomUserGroupDto } from '../user/custom-user-group.dto';

export class UserResponseDto {
  userID: string;
  userName: string;
  email: string;
  phone: string;
  accessToken: string;
  group: CustomUserGroupDto[];
  permission: object;

  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}
