import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ProxyModule } from "./proxy/proxy.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ProxyModule],
})
export class AppModule {}
