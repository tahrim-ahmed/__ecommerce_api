import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../../../packages/entities/user/permission.entity';
import { permissionObject } from '../../../packages/json/user-permission.json';
import { PermissionDto } from '../../../packages/dto/user/permission.dto';

@Injectable()
export class PermissionSeeder {
  private readonly logger = new Logger(PermissionSeeder.name);

  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async initPermission(): Promise<boolean> {
    await this.createPermission();
    return true;
  }

  async createPermission(): Promise<boolean> {
    try {
      for (const permissionsObject of permissionObject) {
        const permissionDto = await this.generatePermissionDto(
          permissionsObject,
        );
        const role = this.permissionRepository.create(permissionDto);
        await this.permissionRepository.save(role);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async generatePermissionDto(permissionObject: any): Promise<PermissionDto> {
    const permissionDto = new PermissionDto();
    permissionDto.createdAt = new Date();
    permissionDto.updatedAt = new Date();
    permissionDto.permission = permissionObject.permission;
    permissionDto.description = permissionObject.description;
    permissionDto.groupList = permissionObject.groupList;
    permissionDto.groupAdd = permissionObject.groupAdd;
    permissionDto.groupEdit = permissionObject.groupEdit;
    permissionDto.groupDelete = permissionObject.groupDelete;
    permissionDto.permissionList = permissionObject.permissionList;
    permissionDto.permissionAdd = permissionObject.permissionAdd;
    permissionDto.permissionEdit = permissionObject.permissionEdit;
    permissionDto.permissionDelete = permissionObject.permissionDelete;
    permissionDto.userList = permissionObject.userList;
    permissionDto.userAdd = permissionObject.userAdd;
    permissionDto.userEdit = permissionObject.userEdit;
    permissionDto.userDelete = permissionObject.userDelete;
    permissionDto.categoryList = permissionObject.categoryList;
    permissionDto.categoryAdd = permissionObject.categoryAdd;
    permissionDto.categoryEdit = permissionObject.categoryEdit;
    permissionDto.categoryDelete = permissionObject.categoryDelete;
    permissionDto.productList = permissionObject.productList;
    permissionDto.productAdd = permissionObject.productAdd;
    permissionDto.productEdit = permissionObject.productEdit;
    permissionDto.productDelete = permissionObject.productDelete;
    permissionDto.orderList = permissionObject.orderList;
    permissionDto.orderAdd = permissionObject.orderAdd;
    permissionDto.orderEdit = permissionObject.orderEdit;
    permissionDto.orderDelete = permissionObject.orderDelete;
    return permissionDto;
  }
}
