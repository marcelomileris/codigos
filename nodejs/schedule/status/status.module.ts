import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { StatusRepository } from './status.repository';
import { TokenService } from '../token/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatusRepository, PluginconfigRepository]),
  ],
  providers: [StatusRepository, PluginconfigService, TokenService],
  controllers: [],
})
export class StatusModule {}
