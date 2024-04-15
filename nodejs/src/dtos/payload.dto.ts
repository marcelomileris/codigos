import { IsDateString, IsInt, IsPositive, ValidateIf } from 'class-validator';

export class PayloadDto {
  @IsInt()
  @IsPositive()
  pluginspaceId?: number;

  @ValidateIf((o) => o.preDate != undefined)
  @IsDateString()
  preDate: Date;

  @ValidateIf((o) => o.posDate != undefined)
  @IsDateString()
  posDate: Date;
}
