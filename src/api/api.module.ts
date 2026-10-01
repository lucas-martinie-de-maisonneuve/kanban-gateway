import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Provides the shared HTTP client configured for the upstream NestJS API. */
@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      /** Reads the upstream URL from configuration and applies a request timeout. */
      useFactory: (config: ConfigService) => ({
        baseURL: config.getOrThrow<string>('NESTJS_API_URL'),
        timeout: 10_000,
      }),
    }),
  ],
  exports: [HttpModule],
})
export class ApiModule {}
