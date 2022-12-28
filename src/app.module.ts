import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import * as cacheManager from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';
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
import { APP_INTERCEPTOR } from '@nestjs/core';

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
    CacheModule.register({
      isGlobal: true,
      store: cacheManager.caching({
        store: redisStore,
        host: 'localhost', // default host
        port: 6379,
      }),
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    BookmarksModule,
  ],
})
export class AppModule {}
