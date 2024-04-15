import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';
import { TokenService } from '../token/token.service';
import { LocationController } from './location.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationRepository, PluginconfigRepository]),
  ],
  providers: [
    LocationService,
    LocationRepository,
    PluginconfigService,
    TokenService,
  ],
  controllers: [LocationController],
})
export class LocationModule {}
