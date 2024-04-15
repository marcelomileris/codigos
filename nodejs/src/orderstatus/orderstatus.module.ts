import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { OrderStatusRepository } from './orderstatus.repository';
import { TokenService } from '../token/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderStatusRepository, PluginconfigRepository]),
  ],
  providers: [OrderStatusRepository, PluginconfigService, TokenService],
  controllers: [],
})
export class StatusModule {}
