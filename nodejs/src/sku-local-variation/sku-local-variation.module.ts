import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { SkuLocalVariationRepository } from './sku-local-variation.repository';
import { SkuLocalVariationService } from './sku-local-variation.service';
import { TokenService } from '../token/token.service';
import { SkuLocalVariationController } from './sku-local-variation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SkuLocalVariationRepository,
      PluginconfigRepository,
      SkuLocalVariationRepository,
    ]),
  ],
  providers: [SkuLocalVariationService, PluginconfigService, TokenService],
  controllers: [SkuLocalVariationController],
})
export class SkuLocalVariationModule {}
