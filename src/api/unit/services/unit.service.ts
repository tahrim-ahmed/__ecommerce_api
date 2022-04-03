import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ExceptionService } from '../../../packages/services/exception.service';
import { PermissionService } from '../../../packages/services/permission.service';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { RequestService } from '../../../packages/services/request.service';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';
import { UnitEntity } from '../../../packages/entities/unit/unit.entity';
import { UnitDto } from '../../../packages/dto/unit/unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(UnitEntity)
    private readonly unitRepository: Repository<UnitEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[UnitDto[], number]> => {
    try {
      const query = this.unitRepository
        .createQueryBuilder('q')
        .select(['q.id', 'q.name']);

      if (search) {
        query.andWhere('q.name LIKE  :search', { search: `%${search}%` });
      }

      query.orderBy(`q.name`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      const data = await query.getManyAndCount();

      return [plainToInstance(UnitDto, data[0]), data[1]];
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
  ): Promise<[UnitDto[], number]> => {
    try {
      const query = this.unitRepository.createQueryBuilder('q');

      if (search) {
        query.andWhere('((q.name LIKE  :search))', { search: `%${search}%` });
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

      return [plainToInstance(UnitDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (unitDto: UnitDto): Promise<UnitDto> => {
    try {
      const unit = this.unitRepository.create(unitDto);
      await this.unitRepository.save(unit);

      return plainToInstance(UnitDto, unit);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (id: string, unitDto: UnitDto): Promise<UnitDto> => {
    try {
      const savedUnit = await this.getUnit(id);

      await this.unitRepository.save({
        ...savedUnit,
        ...unitDto,
      });

      return this.getUnit(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedCategory = await this.unitRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedCategory.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getUnit = async (id: string): Promise<UnitDto> => {
    const unit = await this.unitRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .getOneOrFail();
    this.exceptionService.notFound(unit, 'Unit Not Found!!');
    return plainToClass(UnitDto, unit);
  };
  /*********************** End checking relations of post *********************/
}
