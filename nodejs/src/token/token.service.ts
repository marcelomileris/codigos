import { Inject, Injectable } from '@nestjs/common';
import { PluginconfigService } from 'src/pluginconfig/pluginconfig.service';

@Injectable()
export class TokenService {
  constructor(
    @Inject(PluginconfigService)
    private plugConfig: PluginconfigService,
  ) {}

  async token(plugin: any) {
    let url;
    try {
      // Recupero as informações da pluginspace para buscar o token
      //const plug = await this.plugConfig.getConfigTemplate();
      if (plugin == undefined) {
        return {
          Dados:
            'Não foi possivel obter dados de configuração dentro do content',
          message: 'error',
          success: false,
        };
      }
      const content = plugin.content;
      url = content.url.slice(-1) == '/' ? content.url : content.url + '/';

      url = url + content.url_login;
      const usuario = content.login;
      const senha = content.pass;
      const timeout = content.timeout ? content.timeout * 1000 : 1000;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axios = require('axios');

      const result = await axios({
        method: 'post',
        url: url,
        timeout: timeout,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        data: { login: usuario, senha: senha },
      });
      return { success: true, value: result.data.accessToken ?? undefined };
    } catch (error) {
      console.log('\x1b[41m', error.message, '[', url, ']', '\x1b[0m');
      return { success: false };
    }
  }
}
