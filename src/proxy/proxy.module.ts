import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { SessionModule } from '../session/session.module';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  imports: [ApiModule, SessionModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
