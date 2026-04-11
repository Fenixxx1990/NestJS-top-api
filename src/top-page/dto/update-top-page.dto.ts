import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { TopLevelCategory } from "../top-page.model";
import { Type } from "class-transformer";
import { HhDataDto, TopPageAdvantageDto } from "./create-top-page.dto";

export class UpdateTopPageDto {
  @IsOptional()
  @IsEnum(TopLevelCategory)
  firstCategory?: TopLevelCategory;

  @IsOptional()
  @IsString()
  secondCategory?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HhDataDto)
  hh?: HhDataDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopPageAdvantageDto)
  advantages?: TopPageAdvantageDto[];

  @IsOptional()
  @IsString()
  seoText?: string;

  @IsOptional()
  @IsString()
  tagsTitle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
