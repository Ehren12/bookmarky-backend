import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    ConfigService,
    UsersService,
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    BookmarksModule,
  ],
})
export class AppModule {}
