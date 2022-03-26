import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../packages/entities/user/group.entity';
import { rolesObject } from '../../../packages/json/user-group.json';
import { GroupDto } from '../../../packages/dto/user/group.dto';

@Injectable()
export class GroupSeeder {
  private readonly logger = new Logger(GroupSeeder.name);

  constructor(
    @InjectRepository(GroupEntity)
    private readonly roleRepository: Repository<GroupEntity>,
  ) {}

  async initRoles(): Promise<boolean> {
    await this.createRoles();
    return true;
  }

  async createRoles(): Promise<boolean> {
    try {
      for (const roleObject of rolesObject) {
        const roleDto = await this.generateRoleDto(roleObject);
        const role = this.roleRepository.create(roleDto);
        await this.roleRepository.save(role);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async generateRoleDto(roleObject: any): Promise<GroupDto> {
    const roleDto = new GroupDto();
    roleDto.createdAt = new Date();
    roleDto.updatedAt = new Date();
    roleDto.group = roleObject.group;
    roleDto.description = roleObject.description;
    return roleDto;
  }
}
