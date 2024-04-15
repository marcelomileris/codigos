import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Serviço Winthor OnLine [NIS]';
  }
}
