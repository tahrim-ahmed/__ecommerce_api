import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';

@Entity({ name: 'status' })
@Index('status-name-deletedat-idx', ['name', 'deletedAt'])
export class OrderStatusEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 255 })
  @Index('status-name-idx', { unique: true })
  name: string;
}
