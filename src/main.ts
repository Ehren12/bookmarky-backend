import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as redisConnect from 'connect-redis';
import * as redis from 'redis';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const RedisStore = redisConnect(session);
  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });
  //security
  app.use(helmet());
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN, credentials: true });
  // const httpAdapter = app.get(HttpAdapterHost).httpAdapter;
  // const expressApp = httpAdapter.getHttpServer();
  // expressApp.set('trust proxy', 1);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: new RedisStore({
        client,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(8080);
}
bootstrap();
