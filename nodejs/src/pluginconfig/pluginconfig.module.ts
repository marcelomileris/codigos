import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from './pluginconfig.repository';
import { PluginconfigService } from './pluginconfig.service';

@Module({
  imports: [TypeOrmModule.forFeature([PluginconfigRepository])],
  controllers: [],
  providers: [PluginconfigService],
})
export class PluginconfigModule {}
