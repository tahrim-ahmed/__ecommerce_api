import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'color_details' })
@Index('color-details-name-deletedat-idx', ['name', 'deletedAt'])
export class ColorDetailsEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('color-details-name-idx', { unique: true })
  name: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.colorDetails)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
