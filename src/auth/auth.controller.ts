import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../../types/authtypes';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local.auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //post / signup
  @Post('/signup')
  async addUser(@Body() dto: SignupDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.hash, saltOrRounds);
    const result = await this.authService.insertUser(dto, hashedPassword);
    try {
      return {
        msg: 'User successfully registered',
        userId: result.id,
        userName: result.email,
      };
    } catch (err) {
      throw err;
    }
  }
  //Login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: Request): object {
    try {
      return { User: req.user, msg: 'User logged in' };
    } catch (err) {
      return {
        msg: 'An error occured',
        error: err,
      };
    }
  }

  @Get('/logout')
  logout(@Req() req: Request): any {
    try {
      req.session.destroy(() => {
        return { msg: 'The user session has ended' }; // will always fire after session is destroyed
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/isAuthenticated')
  isAuthenticated(@Req() req: Request) {
    if (req.user) {
      return true;
    } else {
      return false;
    }
  }
}
