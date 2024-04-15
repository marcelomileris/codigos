import { Controller, Get } from '@nestjs/common';
import { SkuLocalVariationService } from './sku-local-variation.service';

@Controller('skulocalvariation')
export class SkuLocalVariationController {
  constructor(private skuLocalVariationService: SkuLocalVariationService) {}

  @Get()
  doAction() {
    return this.skuLocalVariationService.do();
  }
}
