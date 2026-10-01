import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import session from 'express-session';
import { SessionService } from './session.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

/** Creates a Redis client using the configured host and port. */
function buildRedisClient(config: ConfigService) {
  return createClient({
    socket: {
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: Number(config.get('REDIS_PORT', 6379)),
    },
  });
}

type RedisClient = ReturnType<typeof buildRedisClient>;

@Module({
  imports: [JwtModule.register({})],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      /** Opens the Redis connection before making it available to the application. */
      useFactory: async (config: ConfigService): Promise<RedisClient> => {
        const client = buildRedisClient(config);
        await client.connect();
        return client;
      },
    },
    SessionService,
  ],
  exports: [SessionService],
})
export class SessionModule implements NestModule, OnApplicationShutdown {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
    private readonly config: ConfigService,
  ) { }

  /** Registers the Redis-backed session middleware for every application route. */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new RedisStore({ client: this.redisClient }),
          secret: this.config.getOrThrow<string>('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            sameSite: 'strict',
            secure: this.config.get('NODE_ENV') === 'production',
            maxAge: Number(this.config.get('SESSION_TTL', 3600)) * 1000,
          },
        }),
      )
      .forRoutes('{*splat}');
  }

  /** Closes the Redis connection when NestJS shuts down. */
  async onApplicationShutdown() {
    await this.redisClient.quit();
  }
}
