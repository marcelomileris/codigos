import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { TokenService } from '../token/token.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, PluginconfigRepository]),
  ],
  providers: [OrderService, OrderRepository, PluginconfigService, TokenService],
  controllers: [OrderController],
})
export class OrderModule {}
