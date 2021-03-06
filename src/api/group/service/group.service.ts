import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { GroupEntity } from '../../../packages/entities/user/group.entity';
import { ExceptionService } from '../../../packages/services/exception.service';
import { GroupDto } from '../../../packages/dto/user/group.dto';
import { SystemException } from '../../../packages/exceptions/system.exception';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
    private exceptionService: ExceptionService,
  ) {}

  /*search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[GroupDto[], number]> => {
    try {
      const query = this.groupRepository
        .createQueryBuilder('q')
        .where('q.isActive =:isActive', {
          ...isActive,
        })
        .select(['q.id', 'q.role']);

      if (search) {
        query.andWhere('q.role ILIKE  :search', { search: `%${search}%` });
      }

      query.orderBy(`q.role`, 'DESC', 'NULLS LAST');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(GroupDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };*/

  /*findAll = async (): Promise<GroupDto[]> => {
    const roles = await this.groupRepository.find({ where: { ...isActive } });
    return plainToInstance(GroupDto, roles);
  };*/

  /*findById = async (id: string): Promise<GroupDto> => {
    const role = await this.groupRepository.findOne(id);
    this.exceptionService.notFound(role, 'Role not found!!');
    return plainToClass(GroupDto, role);
  };*/

  /*findByObject = async (dto: GroupDto): Promise<GroupDto | GroupDto[]> => {
    const roles = await this.groupRepository.find({
      ...dto,
    });
    if (roles.length > 1) {
      return plainToClass(GroupDto, roles);
    } else {
      return plainToClass(GroupDto, roles[0]);
    }
  };*/

  create = async (roleDto: GroupDto): Promise<GroupDto> => {
    try {
      const role = this.groupRepository.create(roleDto);
      await this.groupRepository.save(role);

      return plainToClass(GroupDto, role);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  /*update = async (id: string, dto: GroupDto): Promise<GroupDto> => {
    const role = await this.groupRepository.findOne({ id });
    this.exceptionService.notFound(role, 'Role not found!!');
    return this.groupRepository.save({ ...role, ...dto });
  };*/

  /*remove = async (id: string): Promise<DeleteDto> => {
    const role = await this.groupRepository.findOne({ id });
    this.exceptionService.notFound(role, 'Role not found!!');
    const deleted = await this.groupRepository.delete({ id });
    return Promise.resolve(new DeleteDto(!!deleted.affected));
  };*/
}
