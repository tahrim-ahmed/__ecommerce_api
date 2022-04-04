import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'variation' })
@Index('variation-name-deletedat-idx', ['name', 'deletedAt'])
export class VariationEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('variation-name-idx', { unique: true })
  name: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.variation)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
