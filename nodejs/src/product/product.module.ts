import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { TokenService } from '../token/token.service';
import { ProductController } from './product.controller';
import { LocationService } from 'src/location/location.service';
import { SkuLocalVariationService } from 'src/sku-local-variation/sku-local-variation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, PluginconfigRepository]),
  ],
  providers: [
    ProductService,
    ProductRepository,
    PluginconfigService,
    TokenService,
    LocationService,
    SkuLocalVariationService,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
