import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class PositionDto {
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
}

export class UpdateDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PositionDto)
  positions: PositionDto[];
}
