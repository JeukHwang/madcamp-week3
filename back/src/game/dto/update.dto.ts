import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class PositionDto {
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
}

export class UpdateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  positions: PositionDto[];
}
