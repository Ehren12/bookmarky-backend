import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  UseGuards,
  Inject,
  CACHE_MANAGER,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
  CacheKey,
} from '@nestjs/common';
import Cache from 'cache-manager';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserEditDto } from './dto';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('custom-key')
  @CacheTTL(30)
  @Get('/:userId')
  getHello(@Param('userId') userId: string, @Req() req: Request): object {
    try {
      return this.usersService.getUser(userId);
    } catch (err) {
      return err;
    }
  }
}
