import 'dotenv';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PluginconfigRepository } from './pluginconfig.repository';

@Injectable()
export class PluginconfigService {
  constructor(
    @InjectRepository(PluginconfigRepository)
    private pluginconfigRepository: PluginconfigRepository,
  ) {}

  async getConfigTemplate(pluginspaceId?: string | number) {
    const getconfig = await this.pluginconfigRepository.getConfig(
      process.env.PLUGINTEMPLATE_ID,
      process.env.PLUGINTYPE_ID,
      pluginspaceId,
    );
    return getconfig;
  }
}
