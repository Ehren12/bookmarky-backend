import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  hash: string;
  @IsString()
  @IsNotEmpty()
  role: 'user' | 'admin';

  // Optional Fields
  @IsString()
  @IsOptional()
  firstName?: string;
  @IsString()
  @IsOptional()
  lastName?: string;
}
