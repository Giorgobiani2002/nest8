import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class queryParamsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take: number = 20;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number = 1;
}
