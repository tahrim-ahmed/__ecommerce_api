import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { configEnvironment } from './packages/env-config/env-config';
import { AuthMiddleware } from './packages/middlewares/auth.middleware';
import { publicUrls } from './public.url';
import { configTypeorm } from './packages/typeorm-config/typeorm.config';
import { GroupModule } from './api/group/group.module';
import { UserModule } from './api/users/user.module';
import { AuthModule } from './api/auth/auth.module';
import { FilesModule } from './api/files/files.module';
import { CategoryModule } from './api/category/category.module';
import { SubCategoryModule } from './api/category/sub-category.module';
import { BrandModule } from './api/brand/brand.module';
import { ProductModule } from './api/product/product.module';
import { UnitModule } from './api/unit/unit.module';
import { OrderStatusModule } from './api/order-status/order-status.module';

@Module({
  imports: [
    configEnvironment(),
    configTypeorm(),
    AuthModule,
    GroupModule,
    UserModule,
    FilesModule,
    UnitModule,
    OrderStatusModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicUrls)
      .forRoutes('*');
  }
}
