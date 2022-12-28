import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserEditDto } from './dto';
import { GetUser } from '../auth/decorators/get_user.decorator';
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthenticatedGuard)
  @Patch('edit')
  editUser(
    @Body() dto: UserEditDto,
    @Req() req: Request,
    @GetUser('userId') userId: string,
  ) {
    if (!req.user) {
      return {
        msg: 'Oops your session seems to have expired try logging in again',
        status: HttpCode(HttpStatus.UNAUTHORIZED),
      };
    }
    try {
      return this.usersService.editUser(userId, dto);
    } catch (err) {
      return err;
    }
  }
}
