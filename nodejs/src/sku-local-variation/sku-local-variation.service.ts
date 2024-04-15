import 'dotenv';
import { Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from '../token/token.service';
import { SkuLocalVariationRepository } from './sku-local-variation.repository';
import { LocationRepository } from 'src/location/location.repository';
import { Connection } from 'typeorm';

@Injectable()
export class SkuLocalVariationService {
  private skuLocalVariationRepository: SkuLocalVariationRepository;
  private locationRepository: LocationRepository;
  constructor(
    private readonly connection: Connection,
    private pluginconfigService: PluginconfigService,
    private tokenService: TokenService,
  ) {
    this.skuLocalVariationRepository = this.connection.getCustomRepository(
      SkuLocalVariationRepository,
    );
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);
  }

  async init(): Promise<any> {
    return;
  }

  async do(): Promise<any> {
    return;
  }

  async update(
    plugin: any,
    pluginspaceId: any,
    product: any,
    item: any,
  ): Promise<any> {
    try {
      const locations = await this.locationRepository.findAll(pluginspaceId);
      for await (const location of locations) {
        const exists =
          await this.skuLocalVariationRepository.findByProductIdLocation(
            product.id,
            pluginspaceId,
            location.id,
          );

        const data = {
          locationId: location.id,
          pluginspaceId: pluginspaceId,
          status: true,
          productId: product.id,
          productCode: product.code.split('-')[1],
          //price: 0,
          //inventory: 0,
          //minimumStock: 0,
          //costPrice: 0,
          referenceCode: item.productSKUId,
          sku: item.productSKUId,
          context: '{"VARIATION":"NONE"}',
        };

        if (exists) {
          if (
            data.productCode != exists.productCode ||
            data.referenceCode != exists.referenceCode ||
            data.sku != exists.sku ||
            data.context != exists.context ||
            data.status != exists.status
          ) {
            await this.skuLocalVariationRepository.update(exists.id, data);
            console.log(
              `\t \x1b[32m atualizado \x1b[0m \x1b[32m${location.name}\x1b[0m`,
              //item.name.padEnd(50, ' '),
              //`${plugin.name} - ${plugin.pluginspaceId}`,
            );
          } else {
            console.log(
              `\t \x1b[42m\x1b[31m inalterado \x1b[0m \x1b[32m${location.name}\x1b[0m`,
              //item.name.padEnd(50, ' '),
              //`${plugin.name} - ${plugin.pluginspaceId}`,
            );
          }
        } else {
          await this.skuLocalVariationRepository.create(data).save();
          console.log(
            `\t \x1b[32m criado \x1b[0m \x1b[32m${location.name}\x1b[0m`,
            //item.name.padEnd(50, ' '),
            //`${plugin.name} - ${plugin.pluginspaceId}`,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
