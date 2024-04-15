import {
	Controller,
	Post,
	Req,
	Res,
	Param,
	HttpStatus,
	Body,
	Get,
} from "@nestjs/common";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { PayloadDto } from "src/dtos/payload.dto";
import { ClassificationService } from "./classification.service";

@Controller("classifications")
export class ClassificationController {
	constructor(private classificationService: ClassificationService) {}

	@Post("/all")
	@ApiBody({ type: PayloadDto })
	@ApiResponse({ status: 400, description: "Bad Request." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	async all(
		@Req() req: Request,
		@Res() res: Response,
		@Body() payloadDto: PayloadDto
	) {
		console.log(`Classificador \x1b[32m AWS [${req.ip}] \x1b[0m`);
		const ret = await this.classificationService.do(
			undefined,
			req.ip,
			payloadDto
		);
		if (ret.success) {
			return res.status(HttpStatus.OK).json(ret);
		} else {
			return res.status(HttpStatus.BAD_REQUEST).json(ret);
		}
	}

	@Post()
	@ApiBody({ type: PayloadDto })
	@ApiResponse({ status: 400, description: "Bad Request." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	async byId(
		@Req() req: Request,
		@Res() res: Response,
		@Body() payloadDto: PayloadDto
	) {
		console.log(`Classificador \x1b[32m MANUAL [${req.ip}] \x1b[0m`);
		const ret = await this.classificationService.do(
			payloadDto.pluginspaceId,
			req.ip,
			payloadDto
		);
		if (ret.success) {
			return res.status(HttpStatus.OK).json(ret);
		} else {
			return res.status(HttpStatus.BAD_REQUEST).json(ret);
		}
	}
}
