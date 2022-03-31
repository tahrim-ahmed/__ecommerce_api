import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ExceptionService } from '../../../packages/services/exception.service';
import { PermissionService } from '../../../packages/services/permission.service';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { RequestService } from '../../../packages/services/request.service';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';
import { BrandEntity } from '../../../packages/entities/brand/brand.entity';
import { BrandDto } from '../../../packages/dto/brand/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[BrandDto[], number]> => {
    try {
      const query = this.brandRepository
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

      return [plainToInstance(BrandDto, data[0]), data[1]];
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
  ): Promise<[BrandDto[], number]> => {
    try {
      const query = this.brandRepository.createQueryBuilder('q');

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

      return [plainToInstance(BrandDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (brandDto: BrandDto): Promise<BrandDto> => {
    try {
      const brand = this.brandRepository.create(brandDto);
      await this.brandRepository.save(brand);

      return plainToInstance(BrandDto, brand);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (id: string, brandDto: BrandDto): Promise<BrandDto> => {
    try {
      const savedBrand = await this.getBrand(id);

      await this.brandRepository.save({
        ...savedBrand,
        ...brandDto,
      });

      return this.getBrand(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedCategory = await this.brandRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedCategory.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getBrand = async (id: string): Promise<BrandDto> => {
    const brand = await this.brandRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .getOneOrFail();
    this.exceptionService.notFound(brand, 'Brand Not Found!!');
    return plainToClass(BrandDto, brand);
  };
  /*********************** End checking relations of post *********************/
}
