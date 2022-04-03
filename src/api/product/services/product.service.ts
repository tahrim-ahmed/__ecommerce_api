import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ExceptionService } from '../../../packages/services/exception.service';
import { PermissionService } from '../../../packages/services/permission.service';
import { RequestService } from '../../../packages/services/request.service';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';
import { ProductDto } from '../../../packages/dto/product/product.dto';
import { CreateProductDto } from '../../../packages/dto/create/create-product.dto';
import { ProductEntity } from '../../../packages/entities/product/product.entity';
import { SubCategoryService } from '../../category/services/sub-category.service';
import { BrandService } from '../../brand/services/brand.service';
import { ColorDetailsEntity } from '../../../packages/entities/color-details/color-details.entity';
import { ColorDetailsDto } from '../../../packages/dto/color-details/color-details.dto';
import { UnitService } from '../../unit/services/unit.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ColorDetailsEntity)
    private readonly colorDetailsRepository: Repository<ColorDetailsEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
    private readonly subCategoryService: SubCategoryService,
    private readonly brandService: BrandService,
    private readonly unitService: UnitService,
  ) {}

  search = async (
    page: number,
    limit: number,
    subCategoryID: string,
    brandID: string,
    search: string,
  ): Promise<[ProductDto[], number]> => {
    try {
      const query = this.productRepository.createQueryBuilder('q');

      query.select([
        'q.id',
        'q.name',
        'q.description',
        'q.quantity',
        'q.price',
        'q.discount',
      ]);

      if (search) {
        query.andWhere('q.name LIKE  :search', { search: `%${search}%` });
      }

      query.orderBy(`q.name`, 'DESC');

      if (page && limit) {
        query.skip((page - 1) * limit).take(limit);
      }

      query
        .innerJoin('q.subCategory', 'subCategory')
        .addSelect(['subCategory.name'])
        .innerJoin('subCategory.category', 'category')
        .addSelect(['category.name'])
        .innerJoin('q.brand', 'brand')
        .addSelect(['brand.name']);

      const data = await query.getManyAndCount();

      return [plainToClass(ProductDto, data[0]), data[1]];
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
  ): Promise<[ProductDto[], number]> => {
    try {
      const query = this.productRepository.createQueryBuilder('q');

      query
        .innerJoin('q.subCategory', 'subCategory')
        .addSelect(['subCategory.name'])
        .innerJoin('subCategory.category', 'category')
        .addSelect(['category.name'])
        .innerJoin('q.brand', 'brand')
        .addSelect(['brand.name']);

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

      return [plainToInstance(ProductDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (productDto: CreateProductDto): Promise<ProductDto> => {
    try {
      productDto.subCategory = await this.subCategoryService.getSubCategory(
        productDto.subCategoryID,
      );

      productDto.brand = await this.brandService.getBrand(productDto.brandID);

      productDto.unit = await this.unitService.getUnit(productDto.unitID);

      const colorDetails: ColorDetailsEntity[] = [];

      for (const details of productDto.createColorDetailsDto) {
        let clrDetails = new ColorDetailsEntity();
        clrDetails.name = details.name;
        clrDetails =
          this.requestService.forCreate<ColorDetailsEntity>(clrDetails);

        const created = this.colorDetailsRepository.create(clrDetails);
        colorDetails.push(await this.colorDetailsRepository.save(created));
      }

      productDto.colorDetails = plainToInstance(ColorDetailsDto, colorDetails);

      const product = this.productRepository.create(productDto);
      await this.productRepository.save(product);

      return this.getProduct(product.id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (
    id: string,
    productDto: CreateProductDto,
  ): Promise<ProductDto> => {
    try {
      const savedProduct = await this.getProduct(id);

      if (productDto.subCategoryID) {
        productDto.subCategory = await this.subCategoryService.getSubCategory(
          productDto.subCategoryID,
        );
      }

      if (productDto.brandID) {
        productDto.brand = await this.brandService.getBrand(productDto.brandID);
      }

      if (productDto.unitID) {
        productDto.unit = await this.unitService.getUnit(productDto.unitID);
      }

      if (productDto.createColorDetailsDto.length) {
        const colorDetails: ColorDetailsEntity[] = [];

        for (const details of productDto.createColorDetailsDto) {
          const oldColorDetail = await this.getColorDetailByProductID(id);

          await this.removeColorDetails(id);

          let clrDetails = new ColorDetailsEntity();
          clrDetails.name = details.name;

          // preserve the previous date
          clrDetails.createdBy = oldColorDetail.createdBy;
          clrDetails.createdAt = oldColorDetail.createdAt;

          clrDetails =
            this.requestService.forUpdate<ColorDetailsEntity>(clrDetails);

          const created = this.colorDetailsRepository.create(clrDetails);
          colorDetails.push(await this.colorDetailsRepository.save(created));
        }

        productDto.colorDetails = plainToInstance(
          ColorDetailsDto,
          colorDetails,
        );
      }

      await this.productRepository.save({
        ...savedProduct,
        ...productDto,
      });

      return this.getProduct(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedProduct = await this.productRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedProduct.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getProduct = async (id: string): Promise<ProductDto> => {
    const product = await this.productRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .leftJoinAndSelect('q.subCategory', 'subCategory')
      .leftJoinAndSelect('q.brand', 'brand')
      .getOneOrFail();

    this.exceptionService.notFound(product, 'Product Not Found!!');
    return plainToClass(ProductDto, product);
  };

  getColorDetailByProductID = async (
    productID: string,
  ): Promise<ColorDetailsDto> => {
    const colorDetail = await this.colorDetailsRepository
      .createQueryBuilder('q')
      .where('q.product_id =:prdID', { prdID: productID })
      .getOne();
    this.exceptionService.notFound(colorDetail, 'Color Details Not Found!!');

    return plainToInstance(ColorDetailsDto, colorDetail);
  };

  async removeColorDetails(productID: string): Promise<boolean> {
    return !!(await this.colorDetailsRepository
      .createQueryBuilder('q')
      .where('q.product_id =:prdID', {
        prdID: productID,
      })
      .delete());
  }
  /*********************** End checking relations of post *********************/
}
