import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  link: string;
}
