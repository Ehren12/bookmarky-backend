import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/:userId')
  getHello(@Param('userId') userId: string): object {
    try {
      return this.usersService.getUser(userId);
    } catch (err) {
      return err;
    }
  }
}
