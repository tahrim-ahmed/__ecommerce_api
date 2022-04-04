import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ExceptionService } from '../../../packages/services/exception.service';
import { PermissionService } from '../../../packages/services/permission.service';
import { SystemException } from '../../../packages/exceptions/system.exception';
import { RequestService } from '../../../packages/services/request.service';
import { DeleteDto } from '../../../packages/dto/response/delete.dto';
import { OrderStatusEntity } from '../../../packages/entities/order-status/order-status.entity';
import { OrderStatusDto } from '../../../packages/dto/order-status/order-status.dto';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatusEntity)
    private readonly orderStatusRepository: Repository<OrderStatusEntity>,
    private readonly exceptionService: ExceptionService,
    private readonly permissionService: PermissionService,
    private readonly requestService: RequestService,
  ) {}

  search = async (
    page: number,
    limit: number,
    search: string,
  ): Promise<[OrderStatusDto[], number]> => {
    try {
      const query = this.orderStatusRepository
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

      return [plainToInstance(OrderStatusDto, data[0]), data[1]];
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
  ): Promise<[OrderStatusDto[], number]> => {
    try {
      const query = this.orderStatusRepository.createQueryBuilder('q');

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

      return [plainToInstance(OrderStatusDto, data[0]), data[1]];
    } catch (error) {
      throw new SystemException(error);
    }
  };

  create = async (orderStatusDto: OrderStatusDto): Promise<OrderStatusDto> => {
    try {
      const orderStatus = this.orderStatusRepository.create(orderStatusDto);
      await this.orderStatusRepository.save(orderStatus);

      return plainToInstance(OrderStatusDto, orderStatus);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  update = async (
    id: string,
    orderStatusDto: OrderStatusDto,
  ): Promise<OrderStatusDto> => {
    try {
      const savedOrderStatus = await this.getOrderStatus(id);

      await this.orderStatusRepository.save({
        ...savedOrderStatus,
        ...orderStatusDto,
      });

      return this.getOrderStatus(id);
    } catch (error) {
      throw new SystemException(error);
    }
  };

  remove = async (id: string): Promise<DeleteDto> => {
    try {
      const deletedOrderStatus = await this.orderStatusRepository.softDelete({
        id,
      });
      return Promise.resolve(new DeleteDto(!!deletedOrderStatus.affected));
    } catch (error) {
      throw new SystemException(error);
    }
  };
  /********************** Start checking relations of post ********************/

  getOrderStatus = async (id: string): Promise<OrderStatusDto> => {
    const orderStatus = await this.orderStatusRepository
      .createQueryBuilder('q')
      .andWhere('q.id =:id', { id })
      .getOneOrFail();
    this.exceptionService.notFound(orderStatus, 'Order Status Not Found!!');
    return plainToClass(OrderStatusDto, orderStatus);
  };
  /*********************** End checking relations of post *********************/
}
