import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { SessionModule } from '../session/session.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ApiModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
