import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'brands' })
@Index('brands-name-deletedat-idx', ['name', 'deletedAt'])
export class BrandEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('brands-name-idx', { unique: true })
  name: string;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.brand)
  @JoinColumn({ name: 'brand_id' })
  product: ProductEntity[];
}
