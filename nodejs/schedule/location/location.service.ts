import 'dotenv';
import { Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';
import { TokenService } from '../token/token.service';
import { LocationRepository } from './location.repository';
import { Connection } from 'typeorm';

@Injectable()
export class LocationService {
  private locationRepository: LocationRepository;
  constructor(
    private readonly connection: Connection,
    private pluginconfigService: PluginconfigService,
    private tokenService: TokenService,
  ) {
    this.locationRepository =
      this.connection.getCustomRepository(LocationRepository);
  }

  async init(): Promise<any> {
    return;
  }

  async do(): Promise<any> {
    return;
  }

  async update(pluginspaceId: any): Promise<any> {
    return;
  }
}
