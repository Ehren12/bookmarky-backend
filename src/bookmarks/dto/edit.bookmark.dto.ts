import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class EditBookmarkDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
}
