import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { SubCategoryEntity } from '../category/sub-category.entity';
import { BrandEntity } from '../brand/brand.entity';
import { ColorDetailsEntity } from '../color-details/color-details.entity';
import { UnitEntity } from '../unit/unit.entity';

@Entity({ name: 'products' })
@Index('products-name-deletedat-idx', ['name', 'deletedAt'])
export class ProductEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('products-name-idx', { unique: true })
  name: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'decimal', name: 'price' })
  price: string;

  @Column({ type: 'decimal', name: 'discount' })
  discount: string;

  @Column({ type: 'decimal', name: 'quantity' })
  quantity: string;

  @ManyToOne(
    () => SubCategoryEntity,
    (subCategoryEntity) => subCategoryEntity.product,
  )
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategoryEntity;

  @ManyToOne(() => BrandEntity, (brandEntity) => brandEntity.product)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @ManyToOne(() => UnitEntity, (unitEntity) => unitEntity.product)
  @JoinColumn({ name: 'unit_id' })
  unit: UnitEntity;

  @OneToMany(
    () => ColorDetailsEntity,
    (colorDetailsEntity) => colorDetailsEntity.product,
  )
  @JoinColumn({ name: 'product_id' })
  colorDetails: ColorDetailsEntity[];
}
