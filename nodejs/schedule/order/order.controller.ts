import { Controller, Get, Req, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  doAction(@Req() req: Request) {
    console.log(`Order \x1b[32m AWS [${req.ip}] \x1b[0m`);
    return this.orderService.do();
  }

  @Get(':id')
  doActionId(@Param('id') id: string, @Req() req: Request) {
    console.log(`Order \x1b[32m AWS [${req.ip}] \x1b[0m`);
    return this.orderService.do(id);
  }
}
