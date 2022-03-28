import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { SubCategoryEntity } from '../../../packages/entities/category/sub-category.entity';
import { CategoryService } from './category.service';
import { ExceptionService } from '../../../packages/services/exception.service';
import { PermissionService } from '../../../packages/services/permission.service';
import { RequestService } from '../../../packages/services/request.service';
import { SubCategoryDto } from '../../../packages/dto/category/sub-category.dto';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { CreateSubCategoryDto } from '../../../packages/dto/create/create-sub-category.dto';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategoryEntity)
    private readonly subCategoryRepository: Repository<SubCategoryEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
    private readonly categoryService: CategoryService,
  ) {}

  search = async (
    page: number,
    limit: number,
    categoryID: string,
    search: string,
  ): Promise<[SubCategoryDto[], number]> => {
    try {
      const query = this.subCategoryRepository.createQueryBuilder('q');

      query.select(['q.id', 'q.name', 'q.category']);

      if (search) {
        query.andWhere('q.name LIKE  :search', { search: `%${search}%` });
      }

      query.orderBy(`q.name`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      query
        .innerJoin('q.category', 'category')
        .addSelect(['category.name', 'category.id']);

      const data = await query.getManyAndCount();

      return [plainToClass(SubCategoryDto, data[0]), data[1]];
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
  ): Promise<[SubCategoryDto[], number]> => {
    try {
      const query = this.subCategoryRepository.createQueryBuilder('q');

      query
        .innerJoin('q.category', 'category')
        .addSelect(['category.name', 'category.id']);

      if (search) {
        query.andWhere(
          '((q.name LIKE  :search) OR (category.name LIKE  :search))',
          { search: `%${search}%` },
        );
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

      return [plainToInstance(SubCategoryDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategoryDto> => {
    try {
      createSubCategoryDto.category = await this.categoryService.getCategory(
        createSubCategoryDto.categoryID,
      );

      const subCategory =
        this.subCategoryRepository.create(createSubCategoryDto);

      await this.subCategoryRepository.save(subCategory);

      return plainToClass(SubCategoryDto, subCategory);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (
    id: string,
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategoryDto> => {
    try {
      const savedSubCategory = await this.getSubCategory(id);

      if (createSubCategoryDto.categoryID) {
        createSubCategoryDto.category = await this.categoryService.getCategory(
          createSubCategoryDto.categoryID,
        );
      }

      await this.subCategoryRepository.save({
        ...savedSubCategory,
        ...createSubCategoryDto,
      });

      return this.getSubCategory(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedSubCategory = await this.subCategoryRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedSubCategory.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getSubCategory = async (id: string): Promise<SubCategoryDto> => {
    const region = await this.subCategoryRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .leftJoinAndSelect('q.category', 'category')
      .getOneOrFail();

    this.exceptionService.notFound(region, 'Sub-category Not Found!!');
    return plainToClass(SubCategoryDto, region);
  };
  /*********************** End checking relations of post *********************/
}
