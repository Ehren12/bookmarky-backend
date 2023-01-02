import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from '../../types/authtypes';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: username },
    });
    const passwordValid = await bcrypt.compare(password, user.hash);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return {
        userId: user.id,
        userName: user.email,
      };
    }
    return null;
  }
  async insertUser(dto: SignupDto, hashedPassword: string) {
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        hash: hashedPassword,
      },
    });

    delete newUser.hash;
    return newUser;
  }
}
