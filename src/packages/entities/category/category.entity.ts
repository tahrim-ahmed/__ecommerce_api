import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { SubCategoryEntity } from './sub-category.entity';

@Entity({ name: 'categories' })
@Index('categories-name-deletedat-idx', ['name', 'deletedAt'])
export class CategoryEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('categories-name-idx', { unique: true })
  name: string;

  @OneToMany(
    () => SubCategoryEntity,
    (subCategoryEntity) => subCategoryEntity.category,
  )
  @JoinColumn({ name: 'category_id' })
  subCategory: SubCategoryEntity[];
}
