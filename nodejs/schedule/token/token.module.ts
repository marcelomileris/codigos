import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([PluginconfigRepository])],
  controllers: [],
  providers: [TokenService, PluginconfigService],
})
export class TokenModule {}
