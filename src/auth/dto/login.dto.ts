import { IsEmail, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
