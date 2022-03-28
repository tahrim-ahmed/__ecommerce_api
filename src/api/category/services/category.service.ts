import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CategoryEntity } from '../../../packages/entities/category/category.entity';
import { ExceptionService } from '../../../packages/services/exception.service';
import { PermissionService } from '../../../packages/services/permission.service';
import { CategoryDto } from '../../../packages/dto/category/category.dto';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { RequestService } from '../../../packages/services/request.service';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[CategoryDto[], number]> => {
    try {
      const query = this.categoryRepository
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

      return [plainToInstance(CategoryDto, data[0]), data[1]];
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
  ): Promise<[CategoryDto[], number]> => {
    try {
      const query = this.categoryRepository.createQueryBuilder('q');

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

      return [plainToInstance(CategoryDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (categoryDto: CategoryDto): Promise<CategoryDto> => {
    try {
      const category = this.categoryRepository.create(categoryDto);
      await this.categoryRepository.save(category);

      return plainToInstance(CategoryDto, category);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (
    id: string,
    categoryDto: CategoryDto,
  ): Promise<CategoryDto> => {
    try {
      const savedCategory = await this.getCategory(id);

      await this.categoryRepository.save({
        ...savedCategory,
        ...categoryDto,
      });

      return this.getCategory(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedCategory = await this.categoryRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedCategory.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getCategory = async (id: string): Promise<CategoryDto> => {
    const category = await this.categoryRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .getOneOrFail();
    this.exceptionService.notFound(category, 'Category Not Found!!');
    return plainToClass(CategoryDto, category);
  };
  /*********************** End checking relations of post *********************/
}
