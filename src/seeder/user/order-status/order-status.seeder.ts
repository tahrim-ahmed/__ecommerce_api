import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusEntity } from '../../../packages/entities/order-status/order-status.entity';
import { orderStatusObject } from '../../../packages/json/order-status.json';
import { OrderStatusDto } from '../../../packages/dto/order-status/order-status.dto';

@Injectable()
export class OrderStatusSeeder {
  private readonly logger = new Logger(OrderStatusSeeder.name);

  constructor(
    @InjectRepository(OrderStatusEntity)
    private readonly orderStatusRepository: Repository<OrderStatusEntity>,
  ) {}

  async initOrderStatus(): Promise<boolean> {
    await this.createOrderStatus();
    return true;
  }

  async createOrderStatus(): Promise<boolean> {
    try {
      for (const statusObject of orderStatusObject) {
        const orderStatusDto = await this.generateOrderStatusDto(statusObject);
        const status = this.orderStatusRepository.create(orderStatusDto);
        await this.orderStatusRepository.save(status);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
    return true;
  }

  async generateOrderStatusDto(statusObject: any): Promise<OrderStatusDto> {
    const orderStatusDto = new OrderStatusDto();
    orderStatusDto.createdAt = new Date();
    orderStatusDto.updatedAt = new Date();
    orderStatusDto.name = statusObject.name;
    return orderStatusDto;
  }
}
