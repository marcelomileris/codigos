import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginconfigRepository } from 'src/pluginconfig/pluginconfig.repository';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { ClassificationRepository } from './classification.repository';
import { ClassificationService } from './classification.service';
import { TokenService } from '../token/token.service';
import { ClassificationController } from './classification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassificationRepository,
      PluginconfigRepository,
    ]),
  ],
  providers: [
    ClassificationService,
    ClassificationRepository,
    PluginconfigService,
    TokenService,
  ],
  controllers: [ClassificationController],
})
export class ClassificationModule {}
