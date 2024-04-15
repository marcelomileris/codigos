import {
  Controller,
  Post,
  Req,
  Res,
  Param,
  HttpStatus,
  Body,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PayloadDto } from 'src/dtos/payload.dto';
import { PriceService } from './price.service';

@Controller('prices')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Post('/all')
  @ApiBody({ type: PayloadDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async all(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payloadDto: PayloadDto,
  ) {
    console.log(`Preços \x1b[32m AWS [${req.ip}] \x1b[0m`);
    const ret = await this.priceService.do(undefined, req.ip, payloadDto);
    if (ret.success) {
      return res.status(HttpStatus.OK).json(ret);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(ret);
    }
  }

  @Post()
  @ApiBody({ type: PayloadDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async byId(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payloadDto: PayloadDto,
  ) {
    console.log(`Preços \x1b[32m MANUAL [${req.ip}] \x1b[0m`);
    const ret = await this.priceService.do(
      payloadDto.pluginspaceId,
      req.ip,
      payloadDto,
    );
    if (ret.success) {
      return res.status(HttpStatus.OK).json(ret);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(ret);
    }
  }
  // @Get()
  // doAction(@Req() req: Request) {
  //   console.log(`Preços \x1b[32m AWS [${req.ip}] \x1b[0m`);
  //   return this.priceService.do();
  // }

  // @Get(':id')
  // doActionId(@Param('id') id: string, @Req() req: Request) {
  //   console.log(`Preços \x1b[32m AWS [${req.ip}] \x1b[0m`);
  //   return this.priceService.do(id);
  // }
}
