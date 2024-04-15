import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { StockService } from './stock.service';
import { TokenService } from '../token/token.service';
import { StockController } from './stock.controller';
import { SkuLocalVariationService } from 'src/sku-local-variation/sku-local-variation.service';

@Module({
  imports: [TypeOrmModule.forFeature([PluginconfigRepository])],
  providers: [
    StockService,
    PluginconfigService,
    TokenService,
    SkuLocalVariationService,
  ],
  controllers: [StockController],
})
export class StockModule {}
