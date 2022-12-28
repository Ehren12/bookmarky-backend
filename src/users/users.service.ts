import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEditDto } from './dto';
import * as cacheManager from 'cache-manager';
import { MemoryCache } from 'cache-manager';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userId || !user) {
      return {
        msg: 'Hmm... I dont think you put in the correct user id',
      };
    }
    delete user.hash;
    return user;
  }

  async editUser(userId: string, dto: UserEditDto) {
    // find if the user exsists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw 'cannot find user with this id';
    }
    //update user
    try {
      return this.prisma.user.update({
        where: { id: userId },
        data: { ...dto },
      });
    } catch (err) {
      return err;
    }
  }
}
