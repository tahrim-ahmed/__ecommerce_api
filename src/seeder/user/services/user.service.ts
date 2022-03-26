import { Injectable, Logger } from '@nestjs/common';
import { GroupSeeder } from './group.seeder';
import { UserSeeder } from './user.seeder';
import { PermissionSeeder } from './permission.seeder';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly groupSeeder: GroupSeeder,
    private readonly permissionSeeder: PermissionSeeder,
  ) {}

  init = async (): Promise<boolean> => {
    if ((await this.userSeeder.count()) <= 0) {
      await this.groupSeeder.initRoles();
      await this.permissionSeeder.initPermission();
      await this.userSeeder.initUsers();
      return true;
    }
    this.logger.log('Seeder run once!!');
    return false;
  };
}
