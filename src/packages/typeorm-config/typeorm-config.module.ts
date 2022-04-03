import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '../entities/user/group.entity';
import { UserEntity } from '../entities/user/user.entity';
import { UserGroupEntity } from '../entities/user/user-group.entity';
import { PermissionEntity } from '../entities/user/permission.entity';
import { UserPermissionEntity } from '../entities/user/user-permission.entity';
import { CategoryEntity } from '../entities/category/category.entity';
import { SubCategoryEntity } from '../entities/category/sub-category.entity';
import { BrandEntity } from '../entities/brand/brand.entity';
import { ProductEntity } from '../entities/product/product.entity';
import { ColorDetailsEntity } from '../entities/color-details/color-details.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        entities: [
          UserEntity,
          UserGroupEntity,
          GroupEntity,
          PermissionEntity,
          UserPermissionEntity,
          CategoryEntity,
          SubCategoryEntity,
          BrandEntity,
          ProductEntity,
          ColorDetailsEntity,
        ],
        synchronize: <boolean>(
          (configService.get<number>('DATABASE_SYNCRONIZE') == 1)
        ),
        logging:
          configService.get<number>('DATABASE_LOGGING') == 1
            ? ['error', 'warn', 'info', 'schema', 'log']
            : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeormConfigModule {}
