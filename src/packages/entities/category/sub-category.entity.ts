import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'sub_categories' })
@Index('sub-categories-name-deletedat-idx', ['name', 'deletedAt'])
export class SubCategoryEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('sub-categories-name-idx', { unique: true })
  name: string;

  @ManyToOne(
    () => CategoryEntity,
    (categoryEntity) => categoryEntity.subCategory,
  )
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
