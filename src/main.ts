import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { createClient } from "redis";
import RedisStore from "connect-redis";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const session = require('express-session');

  const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST ?? "localhost",
      port: parseInt(process.env.REDIS_PORT ?? "6379"),
    },
  });
  await redisClient.connect();
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET ?? "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: parseInt(process.env.SESSION_TTL ?? "86400") * 1000,
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:4200",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8090);
}
bootstrap();
