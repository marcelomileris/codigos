import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { PriceService } from './price.service';
import { TokenService } from '../token/token.service';
import { PriceController } from './price.controller';
import { SkuLocalVariationService } from 'src/sku-local-variation/sku-local-variation.service';

@Module({
  imports: [TypeOrmModule.forFeature([PluginconfigRepository])],
  providers: [
    PriceService,
    PluginconfigService,
    TokenService,
    SkuLocalVariationService,
  ],
  controllers: [PriceController],
})
export class PriceModule {}
