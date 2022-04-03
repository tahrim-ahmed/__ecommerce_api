import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'units' })
@Index('units-name-deletedat-idx', ['name', 'deletedAt'])
export class UnitEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('units-name-idx', { unique: true })
  name: string;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.brand)
  @JoinColumn({ name: 'unit_id' })
  product: ProductEntity[];
}
