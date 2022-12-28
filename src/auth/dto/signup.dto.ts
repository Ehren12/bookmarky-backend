import { IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 12 })
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
