import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { MarkRepository } from './mark.repository';
import { MarkService } from './mark.service';
import { TokenService } from '../token/token.service';
import { MarkController } from './mark.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MarkRepository, PluginconfigRepository])],
  providers: [MarkService, MarkRepository, PluginconfigService, TokenService],
  controllers: [MarkController],
})
export class MarkModule {}
