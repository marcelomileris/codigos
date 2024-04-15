import 'dotenv';
import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenService } from './token/token.service';
import { PluginconfigService } from './pluginconfig/pluginconfig.service';
import { PluginconfigModule } from './pluginconfig/pluginconfig.module';
import { PluginconfigRepository } from './pluginconfig/pluginconfig.repository';
import { TokenModule } from './token/token.module';
import { ClassificationService } from './classification/classification.service';
import { ClassificationModule } from './classification/classification.module';
import { MarkModule } from './mark/mark.module';
import { MarkService } from './mark/mark.service';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { LocationModule } from './location/location.module';
import { LocationService } from './location/location.service';
import { SkuLocalVariationService } from './sku-local-variation/sku-local-variation.service';
import { SkuLocalVariationModule } from './sku-local-variation/sku-local-variation.module';
import { StockModule } from './stock/stock.module';
import { StockService } from './stock/stock.service';
import { PriceModule } from './price/price.module';
import { PriceService } from './price/price.service';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory: () => ({
        connectionLimit: 10,
        type: 'postgres',
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: Number.parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB,
        synchronize: false,
        entities: [__dirname + '/entities/*.entity.{js,ts}'],
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    ScheduleModule.forRoot(),
    TokenModule,
    PluginconfigModule,
    ClassificationModule,
    MarkModule,
    ProductModule,
    LocationModule,
    SkuLocalVariationModule,
    StockModule,
    PriceModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokenService,
    PluginconfigService,
    PluginconfigRepository,
    ClassificationService,
    MarkService,
    ProductService,
    LocationService,
    SkuLocalVariationService,
    StockService,
    PriceService,
    OrderService,
  ],
})
export class AppModule {}
